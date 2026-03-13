/* SpeakEasyTisha — Canada Trip Planner Quest (A1+ → A2)
   Interactive: filter destinations + meaningful summaries + grammar practice + sorting + builders + listening.
   Touch-friendly: drag OR tap.
   No slang: polite, natural English.
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  // Diagnostics badge + debug box
  const JS_STATUS = document.getElementById("jsStatus");
  if(JS_STATUS) JS_STATUS.textContent = "JS: ✅ loaded";
  const DEBUG = document.getElementById("debugBox");
  function logDebug(msg){
    try{
      if(!DEBUG) return;
      DEBUG.classList.remove("hidden");
      DEBUG.textContent += `\n${msg}`;
    }catch(e){}
  }
  window.addEventListener("error", (e) => {
    if(JS_STATUS){
      JS_STATUS.textContent = "JS: ❌ error";
      JS_STATUS.classList.add("no");
    }
    logDebug(`[Error] ${e.message} @ ${e.filename}:${e.lineno}`);
  });
  window.addEventListener("unhandledrejection", (e) => {
    if(JS_STATUS){
      JS_STATUS.textContent = "JS: ❌ promise";
      JS_STATUS.classList.add("no");
    }
    logDebug(`[Promise] ${String(e.reason)}`);
  });

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
    const h = (e) => { try{ handler(e); }catch(err){ console.error(err); } };
    el.addEventListener("click", h);
    el.addEventListener("pointerup", h);
    el.addEventListener("touchend", h, {passive:true});
  }
  function safeEl(sel, root=document){
    try{ return (root || document).querySelector(sel); }catch(e){ return null; }
  }
  function safeOn(sel, evt, handler, root=document){
    const el = safeEl(sel, root);
    if(!el) return;
    el.addEventListener(evt, handler);
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
      u.rate = 0.97;
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
    if(!us || !uk) return;
    if(mode === "en-US"){
      us.classList.add("is-on"); uk.classList.remove("is-on");
      us.setAttribute("aria-pressed","true"); uk.setAttribute("aria-pressed","false");
    }else{
      uk.classList.add("is-on"); us.classList.remove("is-on");
      uk.setAttribute("aria-pressed","true"); us.setAttribute("aria-pressed","false");
    }
  }

  safeOn("#voiceUS","click", () => setVoice("en-US"));
  safeOn("#voiceUK","click", () => setVoice("en-GB"));
  safeOn("#btnPause","click", () => Speech.pause());
  safeOn("#btnResume","click", () => Speech.resume());
  safeOn("#btnStop","click", () => Speech.stop());

  safeOn("#btnStart","click", () => $("#sec1")?.scrollIntoView({behavior:"smooth"}));
  safeOn("#btnHow","click", () => {
    alert(
      "How it works:\n\n" +
      "1) Filter destinations like a real website.\n" +
      "2) Read a real summary (not just 3 lines).\n" +
      "3) Practice grammar: describe, locate, schedule.\n" +
      "4) Compare places politely (better, best, cheaper…).\n" +
      "5) Build a dialogue + a travel plan paragraph.\n\n" +
      "Tip: Tap 🔊 to listen and repeat."
    );
  });

  // Global speak buttons (explanations)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-speak]");
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const t = btn.getAttribute("data-speak");
    if(t) Speech.say(t);
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
    const a=$("#scoreNow"), b=$("#scoreMax");
    if(a) a.textContent = String(Score.now);
    if(b) b.textContent = String(Score.max);
  }
  function updateProgress(){
    const bar = $("#progressBar");
    if(!bar) return;
    const pct = Score.max ? Math.round((Score.now / Score.max) * 100) : 0;
    bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  // ---------- Data: Destinations ----------
  const DESTS = [
    {
      id:"vancouver",
      icon:"🌊",
      name:"Vancouver",
      province:"British Columbia",
      region:"west",
      isCity:true,
      vibes:["city","food","outdoors","relaxing"],
      seasons:["summer","spring","fall"],
      budget:"medium",
      headline:"Ocean + mountains + a very walkable city.",
      summary:
        "Vancouver is on the west coast of Canada, in British Columbia. It is a modern city near the ocean and very close to the mountains. You can walk in Stanley Park, take a boat tour, and enjoy excellent food in many neighborhoods. It is a great choice if you want a city break, but also nature. However, it can be expensive, so it is smart to plan your budget.",
      speak:
        "Vancouver is on the west coast of Canada, in British Columbia. It is a modern city near the ocean and close to the mountains. You can walk in Stanley Park and enjoy great food. However, it can be expensive."
    },
    {
      id:"banff",
      icon:"🏔️",
      name:"Banff & Lake Louise",
      province:"Alberta",
      region:"west",
      isCity:false,
      vibes:["outdoors","scenic","romantic","relaxing"],
      seasons:["summer","winter","fall"],
      budget:"medium",
      headline:"Rocky Mountains, turquoise lakes, and easy hiking.",
      summary:
        "Banff National Park is in Alberta, in western Canada. It is famous for the Rocky Mountains, clear lakes, and beautiful viewpoints. Lake Louise is one of the most scenic places in Canada. You can go hiking in summer, or skiing in winter. It is perfect for a romantic or relaxing trip. Because it is popular, it can be busy in high season, so booking early is helpful.",
      speak:
        "Banff National Park is in Alberta, in western Canada. It is famous for the Rocky Mountains and Lake Louise. You can hike in summer or ski in winter. It is popular, so booking early is helpful."
    },
    {
      id:"toronto",
      icon:"🏙️",
      name:"Toronto",
      province:"Ontario",
      region:"central",
      isCity:true,
      vibes:["city","culture","food","touristy"],
      seasons:["summer","spring","fall","winter"],
      budget:"medium",
      headline:"Big city energy, museums, neighborhoods, and lake views.",
      summary:
        "Toronto is in Ontario, in central Canada, on the shore of Lake Ontario. It is the largest city in the country, with many neighborhoods and international food. You can visit museums, see the CN Tower, and take a ferry to the Toronto Islands. It is also a good base to visit Niagara Falls. Toronto is lively and very diverse, which makes it interesting for culture and restaurants.",
      speak:
        "Toronto is in Ontario, in central Canada, on Lake Ontario. It is a lively city with museums and many neighborhoods. You can see the CN Tower and take a ferry to the islands."
    },
    {
      id:"niagara",
      icon:"💦",
      name:"Niagara Falls",
      province:"Ontario",
      region:"central",
      isCity:false,
      vibes:["touristy","scenic","romantic"],
      seasons:["summer","spring","fall","winter"],
      budget:"medium",
      headline:"A world-famous waterfall and easy day trips.",
      summary:
        "Niagara Falls is on the border between Canada and the United States, in Ontario. The waterfalls are extremely powerful and impressive. You can take a boat tour, walk near the viewpoints, and visit nearby wineries. It is very touristy, but it is also a classic experience. Many travelers visit Niagara as a day trip from Toronto or stay for one night.",
      speak:
        "Niagara Falls is in Ontario, on the border with the United States. The waterfalls are very powerful. You can take a boat tour and visit nearby wineries. It is touristy, but it is a classic experience."
    },
    {
      id:"montreal",
      icon:"🎷",
      name:"Montréal",
      province:"Quebec",
      region:"central",
      isCity:true,
      vibes:["city","culture","food","romantic"],
      seasons:["summer","spring","fall","winter"],
      budget:"medium",
      headline:"French-Canadian culture, festivals, and great cafés.",
      summary:
        "Montréal is in Quebec, in central-eastern Canada. It is a bilingual city with French culture, historic areas, and a strong food scene. You can walk in Old Montréal, visit museums, and enjoy festivals in summer. In winter, you can experience snow and cozy cafés. It is a romantic city, and it often feels European, which many visitors enjoy.",
      speak:
        "Montréal is in Quebec. It is a bilingual city with French culture and great food. You can walk in Old Montréal and visit museums. It is romantic and lively."
    },
    {
      id:"quebeccity",
      icon:"🏰",
      name:"Quebec City",
      province:"Quebec",
      region:"central",
      isCity:true,
      vibes:["historic","romantic","touristy","culture"],
      seasons:["summer","winter","fall"],
      budget:"medium",
      headline:"Historic walls, charming streets, and a strong French feel.",
      summary:
        "Quebec City is in Quebec, in eastern Canada, along the St. Lawrence River. It is one of the oldest cities in North America and is famous for its historic center and city walls. You can explore Old Quebec, visit Château Frontenac, and enjoy French-Canadian cuisine. In winter, it is magical with snow and lights, and it can be very romantic. It is touristy, but the atmosphere is unique.",
      speak:
        "Quebec City is in Quebec, along the St. Lawrence River. It is historic and famous for Old Quebec. In winter it can be very romantic with snow and lights."
    },
    {
      id:"ottawa",
      icon:"🏛️",
      name:"Ottawa",
      province:"Ontario",
      region:"central",
      isCity:true,
      vibes:["culture","historic","city","relaxing"],
      seasons:["summer","spring","fall","winter"],
      budget:"medium",
      headline:"Canada’s capital: museums, canals, and calm city vibes.",
      summary:
        "Ottawa is the capital of Canada, in Ontario, near the border with Quebec. It has important museums, historic buildings, and beautiful parks. You can visit Parliament Hill, walk along the Rideau Canal, and explore national museums. Ottawa is generally calmer than Toronto, so it can feel more relaxing for a city break. In winter, the canal area can be very scenic.",
      speak:
        "Ottawa is the capital of Canada, in Ontario. You can visit Parliament Hill and museums. It is calmer than Toronto, so it can be a relaxing city break."
    },
    {
      id:"halifax",
      icon:"⚓",
      name:"Halifax & Nova Scotia Coast",
      province:"Nova Scotia",
      region:"east",
      isCity:true,
      vibes:["coastal","relaxing","scenic","food"],
      seasons:["summer","spring","fall"],
      budget:"medium",
      headline:"Ocean views, seafood, and coastal drives.",
      summary:
        "Halifax is in Nova Scotia, on Canada’s Atlantic coast. It is a friendly coastal city with a strong maritime history. You can walk on the waterfront, visit historic sites, and enjoy fresh seafood. Nova Scotia is also great for road trips along the coast, with small towns and scenic viewpoints. It is relaxing, and the atmosphere is warm and welcoming.",
      speak:
        "Halifax is in Nova Scotia on the Atlantic coast. It is a friendly coastal city. You can walk on the waterfront and enjoy seafood. Nova Scotia is great for scenic road trips."
    },
    {
      id:"newfoundland",
      icon:"🐋",
      name:"Newfoundland: St. John’s & Gros Morne",
      province:"Newfoundland and Labrador",
      region:"east",
      isCity:true,
      vibes:["outdoors","scenic","unique","relaxing"],
      seasons:["summer","spring","fall"],
      budget:"medium",
      headline:"Dramatic coastlines, whales, and a unique local culture.",
      summary:
        "Newfoundland is in eastern Canada, in the Atlantic. St. John’s is a colorful city by the ocean with a unique local culture. You can often see whales and seabirds along the coast, and the landscapes are dramatic and wild. Gros Morne National Park is famous for hiking and incredible views. It is ideal if you want something different and very scenic.",
      speak:
        "Newfoundland is in eastern Canada in the Atlantic. St. John’s is a colorful city by the ocean. You can often see whales. Gros Morne National Park is famous for hiking and scenic views."
    },
    {
      id:"churchill",
      icon:"🐻‍❄️",
      name:"Churchill (polar bears)",
      province:"Manitoba",
      region:"prairies",
      isCity:false,
      vibes:["unique","wildlife","adventurous","north"],
      seasons:["winter","fall"],
      budget:"high",
      headline:"A famous place for polar bears and northern lights.",
      summary:
        "Churchill is in Manitoba, on the shore of Hudson Bay. It is known worldwide for polar bears in the fall and for northern lights in winter. It is a special trip for wildlife lovers. Because it is remote, it can be more expensive and requires careful planning. If you want an unforgettable experience, Churchill can be one of the most unique choices in Canada.",
      speak:
        "Churchill is in Manitoba on Hudson Bay. It is known for polar bears in the fall and northern lights in winter. It is remote, so it requires planning and it can be expensive."
    },
    {
      id:"yukon",
      icon:"🌌",
      name:"Yukon: Whitehorse & Northern Lights",
      province:"Yukon",
      region:"north",
      isCity:true,
      vibes:["north","adventurous","scenic","relaxing"],
      seasons:["winter","fall","spring"],
      budget:"high",
      headline:"Wide open spaces and strong chances to see the aurora.",
      summary:
        "The Yukon is in northern Canada. Whitehorse is the main city and a good base for exploring the region. In fall and winter, you have strong chances to see the northern lights. You can also experience snowy landscapes and outdoor activities. The Yukon is calm and scenic, but travel distances are long, so planning is important. It is excellent if you want nature and a true northern atmosphere.",
      speak:
        "The Yukon is in northern Canada. Whitehorse is the main city. In fall and winter, you can often see the northern lights. It is calm and scenic, but planning is important."
    }
  ];

  const ALL_VIBES = [
    {key:"relaxing", label:"Relaxing"},
    {key:"romantic", label:"Romantic"},
    {key:"touristy", label:"Touristy"},
    {key:"outdoors", label:"Outdoors"},
    {key:"culture", label:"Culture"},
    {key:"food", label:"Food"},
    {key:"city", label:"City"},
    {key:"scenic", label:"Scenic"},
    {key:"unique", label:"Unique"},
    {key:"wildlife", label:"Wildlife"}
  ];

  // ---------- Destination Explorer ----------
  const state = {
    search:"",
    region:"all",
    season:"all",
    sort:"recommended",
    vibe:null,
    shortlist:new Set()
  };

  function matchesVibe(dest, vibe){
    if(!vibe) return true;
    return dest.vibes.includes(vibe);
  }
  function matchesSearch(dest, q){
    if(!q) return true;
    const t = normalize(q);
    const blob = normalize([
      dest.name, dest.province, dest.region, dest.headline, dest.summary, dest.vibes.join(" ")
    ].join(" "));
    return blob.includes(t);
  }
  function matchesRegion(dest, r){
    if(r === "all") return true;
    return dest.region === r;
  }
  function matchesSeason(dest, s){
    if(s === "all") return true;
    return (dest.seasons || []).includes(s);
  }
  function scoreForSort(dest, sort){
    // Simple educational ranking (not real prices)
    const vibe = (k) => dest.vibes.includes(k) ? 10 : 0;
    const budget = dest.budget === "low" ? 10 : dest.budget === "medium" ? 6 : 2;
    switch(sort){
      case "budget": return budget + vibe("city") + vibe("relaxing");
      case "romantic": return vibe("romantic") + vibe("scenic") + vibe("historic");
      case "outdoors": return vibe("outdoors") + vibe("scenic") + vibe("wildlife");
      case "city": return vibe("city") + vibe("food") + vibe("culture");
      default: return 8 + vibe("scenic") + vibe("culture") + vibe("outdoors");
    }
  }

  function renderVibeTags(){
    const host = $("#vibeTags");
    if(!host) return;
    host.innerHTML = "";
    ALL_VIBES.forEach(v => {
      const b = document.createElement("button");
      b.className = "tagbtn" + (state.vibe === v.key ? " is-on" : "");
      b.type = "button";
      b.textContent = v.label;
      attachTap(b, () => {
        state.vibe = (state.vibe === v.key) ? null : v.key;
        renderVibeTags();
        renderDestinations();
      });
      host.appendChild(b);
    });
  }

  // Toast
  let toastTimer=null;
  function toast(text){
    let t = $("#toast");
    if(!t){
      t = document.createElement("div");
      t.id="toast";
      t.style.position="fixed";
      t.style.left="50%";
      t.style.bottom="18px";
      t.style.transform="translateX(-50%)";
      t.style.padding="10px 12px";
      t.style.borderRadius="14px";
      t.style.background="rgba(255,255,255,.92)";
      t.style.color="rgba(8,34,42,.95)";
      t.style.border="1px solid rgba(10,46,52,.12)";
      t.style.fontWeight="950";
      t.style.zIndex="9999";
      t.style.boxShadow="0 10px 24px rgba(0,0,0,.18)";
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.style.display="block";
    clearTimeout(toastTimer);
    toastTimer=setTimeout(() => { try{ t.style.display="none"; }catch(e){} }, 1800);
  }

  function locationLine(dest){
    const reg = dest.region === "west" ? "in the west" :
                dest.region === "east" ? "in the east" :
                dest.region === "north" ? "in the north" :
                dest.region === "prairies" ? "in the prairies" : "in central Canada";
    const coast = dest.name === "Vancouver" ? "on the west coast" :
                  dest.name.includes("Halifax") ? "on the Atlantic coast" :
                  dest.name.includes("Newfoundland") ? "in the Atlantic" : reg;
    return `${dest.name} is ${coast}, in ${dest.province}.`;
  }

  // Modal (simple, lightweight)
  function openModal(dest){
    let modal = $("#modal");
    if(!modal){
      modal = document.createElement("div");
      modal.id = "modal";
      modal.style.position = "fixed";
      modal.style.inset = "0";
      modal.style.background = "rgba(0,0,0,.55)";
      modal.style.display = "grid";
      modal.style.placeItems = "center";
      modal.style.padding = "1rem";
      modal.style.zIndex = "9999";
      modal.innerHTML = `
        <div class="card" style="max-width:900px; width:100%; max-height:85vh; overflow:auto;">
          <div class="card__head">
            <h3 id="mTitle">Title</h3>
            <div class="righttools">
              <button class="btn btn--ghost" id="mSpeak" type="button">🔊 Listen</button>
              <button class="btn btn--ghost" id="mClose" type="button">✕</button>
            </div>
          </div>
          <div id="mBody"></div>
        </div>
      `;
      document.body.appendChild(modal);
      attachTap($("#mClose", modal), () => modal.remove());
      attachTap(modal, (e) => {
        if(e.target === modal) modal.remove();
      });
    }
    $("#mTitle", modal).textContent = `${dest.icon} ${dest.name} — ${dest.province}`;
    $("#mBody", modal).innerHTML = `
      <div class="reading">
        <div class="line"><div class="ico">🗺️</div><div><strong>Location</strong><br/>${escapeHtml(locationLine(dest))}</div></div>
        <div class="line"><div class="ico">✨</div><div><strong>Why go?</strong><br/>${escapeHtml(dest.summary)}</div></div>
        <div class="line"><div class="ico">✅</div><div><strong>Useful sentences</strong><br/>
          <div class="smallrow" style="margin-top:.35rem;">
            <button class="iconbtn" type="button" data-speak="It is a great choice because it is beautiful and interesting.">🔊 It is a great choice…</button>
            <button class="iconbtn" type="button" data-speak="How about we go to ${dest.name} in summer?">🔊 How about we go…?</button>
            <button class="iconbtn" type="button" data-speak="${dest.name} is better than my other option because it has more to do.">🔊 Compare</button>
          </div>
        </div></div>
      </div>
    `;
    attachTap($("#mSpeak", modal), () => Speech.say(dest.speak || dest.summary));
  }

  function destCard(dest){
    const d = document.createElement("div");
    d.className = "dest";
    d.innerHTML = `
      <div class="destTop">
        <div class="destTitle">
          <div class="destIcon">${dest.icon}</div>
          <div>
            <div class="destName">${escapeHtml(dest.name)}</div>
            <div class="destMeta">
              <span class="pillTag">${escapeHtml(dest.province)}</span>
              <span class="pillTag">${escapeHtml(dest.region.toUpperCase())}</span>
              <span class="pillTag">${dest.isCity ? "City" : "Nature"}</span>
              ${dest.budget ? `<span class="pillTag">Budget: ${escapeHtml(dest.budget)}</span>` : ""}
            </div>
          </div>
        </div>

        <button class="iconbtn" type="button" data-fav="${dest.id}" title="Add to shortlist">⭐</button>
      </div>

      <div class="destMeta" style="margin-top:.1rem;">
        ${dest.vibes.slice(0,4).map(v => `<span class="pillTag">${escapeHtml(v)}</span>`).join("")}
      </div>

      <div class="destSummary">
        <strong>${escapeHtml(dest.headline)}</strong><br/>
        ${escapeHtml(dest.summary.split(". ").slice(0,2).join(". ") + ".")}
      </div>

      <div class="destBtns">
        <button class="btn btn--ghost" type="button" data-more="${dest.id}">📖 Read more</button>
        <button class="btn btn--ghost" type="button" data-say="${escapeHtml(dest.speak || dest.headline)}">🔊 Listen</button>
        <button class="btn btn--ghost" type="button" data-location="${dest.id}">🗺️ Location line</button>
      </div>
    `;
    attachTap($("[data-say]", d), (e) => {
      e.stopPropagation();
      Speech.say(dest.speak || dest.summary);
    });
    attachTap($("[data-more]", d), (e) => {
      e.stopPropagation();
      openModal(dest);
    });
    attachTap($("[data-location]", d), (e) => {
      e.stopPropagation();
      const line = locationLine(dest);
      Speech.say(line);
      toast(`Location: ${line}`);
    });
    attachTap($("[data-fav]", d), (e) => {
      e.stopPropagation();
      toggleShortlist(dest.id);
    });
    return d;
  }

  function renderDestinations(){
    const host = $("#destGrid");
    if(!host) return;

    const filtered = DESTS
      .filter(d => matchesVibe(d, state.vibe))
      .filter(d => matchesSearch(d, state.search))
      .filter(d => matchesRegion(d, state.region))
      .filter(d => matchesSeason(d, state.season));

    const sorted = filtered
      .map(d => ({d, s: scoreForSort(d, state.sort)}))
      .sort((a,b) => b.s - a.s)
      .map(x => x.d);

    host.innerHTML = "";
    if(sorted.length === 0){
      const p = document.createElement("div");
      p.className = "card";
      p.innerHTML = "<h3>No results</h3><p class='muted'>Try a different vibe, region, or search word.</p>";
      host.appendChild(p);
      return;
    }
    sorted.forEach(d => host.appendChild(destCard(d)));
  }

  function toggleShortlist(id){
    if(state.shortlist.has(id)) state.shortlist.delete(id);
    else state.shortlist.add(id);
    renderShortlist();
  }

  function renderShortlist(){
    const host = $("#shortlistHost");
    if(!host) return;
    const list = Array.from(state.shortlist).map(id => DESTS.find(d => d.id === id)).filter(Boolean);
    host.innerHTML = "";

    const row = document.createElement("div");
    row.className = "smallrow";
    list.forEach(d => {
      const chip = document.createElement("div");
      chip.className = "pillTag";
      chip.textContent = `${d.icon} ${d.name}`;
      attachTap(chip, () => openModal(d));
      row.appendChild(chip);
    });
    host.appendChild(row);

    const tools = document.createElement("div");
    tools.className = "smallrow";
    tools.style.marginTop = ".6rem";
    tools.innerHTML = `
      <button class="btn" type="button" id="btnShortlistCheck">✅ Check my shortlist</button>
      <button class="hintbtn" type="button" id="btnShortlistHint">💡 Hint</button>
      <div class="feedback hidden" id="shortlistFb"></div>
    `;
    host.appendChild(tools);

    const fb = $("#shortlistFb", host);

    safeOn("#btnShortlistHint","click", () => {
      fb.classList.remove("hidden","ok","no");
      fb.classList.add("no");
      fb.innerHTML = "💡 Choose 3 places with different vibes (example: one city, one nature, one unique).";
    }, host);

    safeOn("#btnShortlistCheck","click", () => {
      fb.classList.remove("hidden","ok","no");
      if(list.length !== 3){
        fb.classList.add("no");
        fb.innerHTML = "❌ Please select exactly <strong>3</strong> places.";
        return;
      }
      list.forEach(d => Score.award(`short:${d.id}`, 1));
      Score.award("short:bonus", 2);
      fb.classList.add("ok");
      fb.innerHTML = "✅ Great shortlist! Now you can compare them in the next sections.";
    }, host);
  }

  safeOn("#btnShortlistReset","click", () => {
    state.shortlist.clear();
    renderShortlist();
  });

  // Filters bindings
  safeOn("#searchBox","input", (e) => {
    state.search = e.target.value || "";
    renderDestinations();
  });
  safeOn("#regionSelect","change", (e) => {
    state.region = e.target.value;
    renderDestinations();
  });
  safeOn("#seasonSelect","change", (e) => {
    state.season = e.target.value;
    renderDestinations();
  });
  safeOn("#sortSelect","change", (e) => {
    state.sort = e.target.value;
    renderDestinations();
  });
  safeOn("#btnClearFilters","click", () => {
    state.search=""; state.region="all"; state.season="all"; state.sort="recommended"; state.vibe=null;
    const s=$("#searchBox"), r=$("#regionSelect"), se=$("#seasonSelect"), so=$("#sortSelect");
    if(s) s.value="";
    if(r) r.value="all";
    if(se) se.value="all";
    if(so) so.value="recommended";
    renderVibeTags();
    renderDestinations();
  });

  // ---------- Component: MCQ ----------
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

      if(q.say) attachTap($("[data-play]", wrap), () => Speech.say(q.say));
      attachTap($("[data-hint]", wrap), () => {
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

  // ---------- Component: Sort ----------
  function makeToken(text){
    const t = document.createElement("div");
    t.className = "token";
    t.textContent = text;
    t.draggable = true;
    t.addEventListener("dragstart", () => { window.__dragToken = t; });
    return t;
  }

  function buildSort(host, categories, items, awardPrefix){
    host.innerHTML = "";
    const bank = document.createElement("div"); bank.className = "bank";
    const grid = document.createElement("div"); grid.className = "placegrid";
    const fb = document.createElement("div"); fb.className = "feedback hidden";
    host.appendChild(bank); host.appendChild(grid); host.appendChild(fb);

    let selected = null;

    function setFb(ok, text){
      fb.classList.remove("hidden","ok","no");
      fb.classList.add(ok ? "ok" : "no");
      fb.textContent = text;
    }

    function makeSortToken(it){
      const t = makeToken(it.label);
      t.dataset.cat = it.cat;
      t.dataset.id = it.id;
      attachTap(t, () => { $$(".token", host).forEach(x => x.classList.remove("is-over")); t.classList.add("is-over"); selected = t; });
      return t;
    }

    function checkToken(tok, catName){
      if(!tok) return;
      const ok = normalize(tok.dataset.cat) === normalize(catName);
      tok.classList.remove("good","bad");
      tok.classList.add(ok ? "good" : "bad");
      if(ok){ Score.award(`${awardPrefix}:${tok.dataset.id}`, 1); setFb(true, "✅ Correct!"); }
      else setFb(false, `❌ Not quite. Hint: ${items.find(x => x.id === tok.dataset.id)?.hint || "Try again."}`);
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
      zone.addEventListener("drop", (e) => { e.preventDefault(); zone.classList.remove("is-over"); const tok=window.__dragToken; if(tok) zone.appendChild(tok); checkToken(tok, cat.name); });

      attachTap(box, (e) => {
        if(e.target.closest("button")) return;
        if(!selected) return;
        zone.appendChild(selected);
        checkToken(selected, cat.name);
        selected.classList.remove("is-over");
        selected = null;
      });

      attachTap($("[data-hint]", box), (e) => { e.stopPropagation(); setFb(false, `💡 Hint: ${cat.hint || ""}`); });
      grid.appendChild(box);
    });

    bank.addEventListener("dragover", (e) => { e.preventDefault(); bank.classList.add("is-over"); });
    bank.addEventListener("dragleave", () => bank.classList.remove("is-over"));
    bank.addEventListener("drop", (e) => { e.preventDefault(); bank.classList.remove("is-over"); const tok=window.__dragToken; if(tok) bank.appendChild(tok); });

    shuffle(items).map(makeSortToken).forEach(t => bank.appendChild(t));

    return {
      reset(){
        fb.classList.add("hidden");
        selected = null;
        $$(".token", host).forEach(t => { t.classList.remove("good","bad","is-over"); bank.appendChild(t); });
      }
    };
  }

  // ---------- Word order builder ----------
  function buildWordOrder(host, items, awardPrefix){
    host.innerHTML = "";
    const resets = [];

    function markBankUsed(tok, used){
      if(used){ tok.classList.add("is-used"); tok.draggable = false; }
      else { tok.classList.remove("is-used"); tok.draggable = true; }
    }
    function attachDnD(tok){ tok.addEventListener("dragstart", () => { window.__dragToken = tok; }); }

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

        attachTap(t, () => {
          if(t.classList.contains("is-used")) return;
          const c = t.cloneNode(true);
          c.dataset.role = "zone";
          c.dataset.sourceTid = t.dataset.tid;
          c.classList.remove("is-used","good","bad");
          c.draggable = true;
          attachDnD(c);

          attachTap(c, (e) => {
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

            attachTap(c, (e2) => {
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

      attachTap($("[data-play]", block), () => Speech.say(it.target));
      attachTap($("[data-hint]", block), () => {
        fb.classList.remove("hidden","ok","no");
        fb.classList.add("no");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${escapeHtml(it.hint || "")}`;
      });
      attachTap($("[data-check]", block), () => {
        const built = $$(".token", zone).map(t => t.textContent.trim()).join(" ").replace(/\s+/g," ").trim()
          .replace(/\s+([,?.!])/g,"$1");
        const ok = normalize(built) === normalize(it.target);
        fb.classList.remove("hidden","ok","no");
        fb.classList.add(ok ? "ok" : "no");
        fb.textContent = ok ? "✅ Perfect!" : `❌ Not yet. You wrote: “${built || "—"}”`;
        if(ok) Score.award(`${awardPrefix}:${it.key}`, 2);
      });
      attachTap($("[data-clear]", block), () => {
        $$(".token", zone).forEach(z => { const sid=z.dataset.sourceTid; z.remove(); markBankUsed(tidToBank.get(sid), false); });
        fb.classList.add("hidden");
      });

      resets.push(() => {
        $$(".token", zone).forEach(z => { const sid=z.dataset.sourceTid; z.remove(); markBankUsed(tidToBank.get(sid), false); });
        fb.classList.add("hidden");
      });

      host.appendChild(block);
    });

    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------- Listening ----------
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

      attachTap($("[data-play]", block), () => Speech.say(it.say || it.prompt));
      attachTap($("[data-hint]", block), () => {
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

      resets.push(() => { $$("input[type=radio]", block).forEach(x => x.checked = false); fb.classList.add("hidden"); });
      host.appendChild(block);
    });
    return { reset(){ resets.forEach(fn => fn()); } };
  }

  // ---------- Section data ----------
  const grammarMCQ = [
    { key:"g1", prompt:"Choose the best sentence (location).",
      choices:["Vancouver is on the west coast, in British Columbia.","Vancouver is at Canada.","Vancouver is between mountain."],
      answer:0, hint:"Use: on the west coast / in British Columbia.", explain:"Use 'on' for coasts and 'in' for provinces." },
    { key:"g2", prompt:"Choose the best sentence (description).",
      choices:["It is a lively city with great food.","It is lively city great food.","It is the livelyest city."],
      answer:0, hint:"Use: It is a + adjective + noun.", explain:"Basic A1+ structure: It is a lively city." },
    { key:"g3", prompt:"Choose the best time phrase.",
      choices:["in July","on July","at July"], answer:0, hint:"Months use 'in'.", explain:"We say: in July / in summer." },
    { key:"g4", prompt:"Choose the best sentence (activity).",
      choices:["You can go hiking in summer.","You can to go hiking.","You can hiking."],
      answer:0, hint:"Use: can + base verb.", explain:"Modal verb 'can' uses the base verb." }
  ];

  const adjCategories = [
    {name:"Relaxing", icon:"🪷", desc:"calm, slow, comfortable", hint:"Think: calm and easy."},
    {name:"Romantic", icon:"💛", desc:"charming, special, good for couples", hint:"Think: for couples."},
    {name:"Touristy", icon:"📸", desc:"popular, many visitors, classic sights", hint:"Think: many tourists."},
    {name:"Adventurous", icon:"🧗", desc:"active, wild, outdoors, exciting", hint:"Think: action and nature."}
  ];
  const adjItems = [
    {id:"a1", label:"calm", cat:"Relaxing", hint:"calm → relaxing"},
    {id:"a2", label:"quiet", cat:"Relaxing", hint:"quiet → relaxing"},
    {id:"a3", label:"comfortable", cat:"Relaxing", hint:"comfortable → relaxing"},
    {id:"a4", label:"charming", cat:"Romantic", hint:"charming → romantic"},
    {id:"a5", label:"romantic", cat:"Romantic", hint:"romantic → romantic"},
    {id:"a6", label:"historic", cat:"Romantic", hint:"historic streets can feel romantic"},
    {id:"a7", label:"popular", cat:"Touristy", hint:"popular → touristy"},
    {id:"a8", label:"crowded", cat:"Touristy", hint:"crowded → touristy"},
    {id:"a9", label:"famous", cat:"Touristy", hint:"famous → touristy"},
    {id:"a10", label:"wild", cat:"Adventurous", hint:"wild nature → adventurous"},
    {id:"a11", label:"exciting", cat:"Adventurous", hint:"exciting → adventurous"},
    {id:"a12", label:"active", cat:"Adventurous", hint:"active → adventurous"}
  ];

  const compMCQ = [
    { key:"c1", prompt:"Choose the correct comparative.", choices:["Banff is more scenic than Toronto.","Banff is scenicest than Toronto.","Banff is more scenic that Toronto."], answer:0,
      hint:"more + adjective + than", explain:"Use 'than' after a comparative." },
    { key:"c2", prompt:"Choose the correct superlative.", choices:["Niagara Falls is one of the most famous places in Canada.","Niagara Falls is more famous place in Canada.","Niagara Falls is famousest in Canada."], answer:0,
      hint:"one of the most + adjective + noun", explain:"Use 'most' for long adjectives." },
    { key:"c3", prompt:"Choose the correct form.", choices:["Ottawa is calmer than Toronto.","Ottawa is more calm than Toronto.","Ottawa is calmest than Toronto."], answer:0,
      hint:"calm → calmer", explain:"Short adjectives often take -er." },
    { key:"c4", prompt:"Choose the polite connector.", choices:["I prefer Quebec City because it feels historic.","I prefer Quebec City cuz it is old.","I prefer Quebec City, like, it is old."], answer:0,
      hint:"Use 'because' (not slang).", explain:"Use clear connectors: because, however, also." }
  ];

  const compBuilderItems = [
    { key:"cb1", title:"Compare two places (polite)", target:"Quebec City is more romantic than Toronto because it feels historic.",
      tokens:["Quebec","City","is","more","romantic","than","Toronto","because","it","feels","historic."],
      hint:"Use: more + adjective + than + because…" },
    { key:"cb2", title:"Budget comparison", target:"Ottawa is cheaper than Vancouver; however, Vancouver has more nature nearby.",
      tokens:["Ottawa","is","cheaper","than","Vancouver;","however,","Vancouver","has","more","nature","nearby."],
      hint:"Use: cheaper than… however…" }
  ];

  const dialogueItems = [
    { key:"d1", role:"Partner", prompt:"Where would you like to go in Canada?",
      say:"Where would you like to go in Canada?",
      choices:["How about we visit Quebec City? It looks romantic.","Canada is big yes.","I go place."],
      answer:0, hint:"Use: How about we…?", explain:"A polite, natural suggestion." },
    { key:"d2", role:"Partner", prompt:"Why do you prefer Quebec City?",
      say:"Why do you prefer Quebec City?",
      choices:["Because it feels historic, and it has charming streets.","Because yes.","I prefer because romantic."],
      answer:0, hint:"Use: because + reason.", explain:"Give a clear reason." },
    { key:"d3", role:"Partner", prompt:"What about Banff? It looks scenic.",
      say:"What about Banff? It looks scenic.",
      choices:["It is beautiful; however, it can be expensive.","Banff is more scenic that.","We go because go."],
      answer:0, hint:"Use: however to balance.", explain:"Polite contrast with 'however'." },
    { key:"d4", role:"Partner", prompt:"When should we go?",
      say:"When should we go?",
      choices:["We could go in July, from July 10th to July 15th.","We go at July.","We go on summer."],
      answer:0, hint:"Use: in July / from…to…", explain:"Correct prepositions for time." }
  ];

  const suggestBuilderItems = [
    { key:"sb1", title:"Make a suggestion", target:"How about we go to Montréal in summer? It is lively and cultural.",
      tokens:["How","about","we","go","to","Montréal","in","summer?","It","is","lively","and","cultural."],
      hint:"How about we go to… + in + season." },
    { key:"sb2", title:"Plan a date/time", target:"Let’s visit Toronto on July 12th and go to a museum at 2 pm.",
      tokens:["Let’s","visit","Toronto","on","July","12th","and","go","to","a","museum","at","2","pm."],
      hint:"on + date, at + time." }
  ];

  const ACTIVITIES = [
    {id:"act1", label:"visit museums"},
    {id:"act2", label:"walk by the water"},
    {id:"act3", label:"try local food"},
    {id:"act4", label:"go hiking"},
    {id:"act5", label:"take a boat tour"},
    {id:"act6", label:"see wildlife"}
  ];
  const planState = { acts: new Set() };

  function renderPlanSelects(){
    const a = $("#planDest"), b = $("#planOther");
    if(!a || !b) return;
    a.innerHTML = "";
    b.innerHTML = "";
    DESTS.forEach(d => {
      const o1 = document.createElement("option"); o1.value = d.id; o1.textContent = d.name;
      const o2 = document.createElement("option"); o2.value = d.id; o2.textContent = d.name;
      a.appendChild(o1); b.appendChild(o2);
    });
    if(DESTS[0]) a.value = DESTS[0].id;
    if(DESTS[1]) b.value = DESTS[1].id;
  }
  function renderActivityChips(){
    const host = $("#activityChips");
    if(!host) return;
    host.innerHTML = "";
    ACTIVITIES.forEach(a => {
      const c = document.createElement("button");
      c.className = "chip" + (planState.acts.has(a.id) ? " is-on" : "");
      c.type = "button";
      c.textContent = a.label;
      attachTap(c, () => {
        if(planState.acts.has(a.id)) planState.acts.delete(a.id);
        else planState.acts.add(a.id);
        renderActivityChips();
      });
      host.appendChild(c);
    });
  }
  function buildParagraph(){
    const destId = $("#planDest")?.value;
    const otherId = $("#planOther")?.value;
    const time = $("#planTime")?.value || "in summer";
    const dates = $("#planDates")?.value || "for one week";
    const style = $("#planStyle")?.value || "relaxing";
    const comp = $("#planCompare")?.value || "and it is cheaper than";
    const dest = DESTS.find(d => d.id === destId) || DESTS[0];
    const other = DESTS.find(d => d.id === otherId) || DESTS[1] || DESTS[0];

    const acts = Array.from(planState.acts).slice(0,2).map(id => ACTIVITIES.find(a => a.id === id)?.label).filter(Boolean);
    const actText = acts.length ? acts.join(" and ") : "visit museums and try local food";

    const loc = locationLine(dest);
    const sentence1 = `We would like to visit ${dest.name} ${time}, ${dates}.`;
    const sentence2 = `${loc} It is a ${style} place, and you can ${actText}.`;
    const sentence3 = `${dest.name} is a good choice ${comp} ${other.name} because it has a great atmosphere.`;
    return `${sentence1} ${sentence2} ${sentence3}`;
  }
  function renderChecklist(text){
    const host = $("#planChecklist");
    if(!host) return false;
    const checks = [
      {key:"loc", label:"Location line (in / on)", test: /is\s+(on|in)\s+/i},
      {key:"time", label:"Time phrase (in / on / at)", test: /\b(in|on|at)\b/i},
      {key:"can", label:"Activity with “can”", test: /\bcan\b/i},
      {key:"comp", label:"Comparison (than / more / cheaper / however)", test: /\bthan\b|\bmore\b|\bcheaper\b|\bhowever\b/i},
      {key:"because", label:"Reason with “because”", test: /\bbecause\b/i},
    ];
    host.innerHTML = "";
    checks.forEach(c => {
      const ok = c.test.test(text);
      const div = document.createElement("div");
      div.className = "checkitem " + (ok ? "ok" : "no");
      div.textContent = (ok ? "✅ " : "❌ ") + c.label;
      host.appendChild(div);
    });
    return checks.every(c => c.test.test(text));
  }

  safeOn("#btnPlanBuild","click", () => {
    if(planState.acts.size < 2){ toast("Choose 2 activities first."); return; }
    const out = $("#planOutput"); if(!out) return;
    const para = buildParagraph();
    out.value = para;
    renderChecklist(para);
  });
  safeOn("#btnPlanHint","click", () => {
    const fb = $("#planFeedback"); if(!fb) return;
    fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
    fb.innerHTML = "💡 Include: location, time, 2 activities, comparison, because + reason.";
  });
  safeOn("#btnPlanCheck","click", () => {
    const out = $("#planOutput"); const fb = $("#planFeedback");
    if(!out || !fb) return;
    const okAll = renderChecklist(out.value || "");
    fb.classList.remove("hidden","ok","no");
    if(okAll){ fb.classList.add("ok"); fb.textContent = "✅ Excellent! Complete travel plan."; Score.award("plan:complete", 5); }
    else { fb.classList.add("no"); fb.textContent = "❌ Not yet. Add the missing parts (see checklist)."; }
  });
  safeOn("#btnPlanSpeak","click", () => Speech.say($("#planOutput")?.value || "Please build your paragraph first."));
  safeOn("#btnPlanCopy","click", async () => {
    try{ await navigator.clipboard.writeText($("#planOutput")?.value || ""); toast("Copied!"); }
    catch(e){ toast("Copy failed (browser permission)."); }
  });
  safeOn("#btnPlanReset","click", () => {
    planState.acts.clear(); renderActivityChips();
    const out=$("#planOutput"); if(out) out.value="";
    const fb=$("#planFeedback"); if(fb) fb.classList.add("hidden");
    const cl=$("#planChecklist"); if(cl) cl.innerHTML="";
  });

  const listenItems = [
    { key:"l1", role:"Guide", prompt:"Listen. Which destination is it?",
      say:"It is on the west coast in British Columbia. It is a modern city near the ocean, and it is close to the mountains.",
      choices:["Vancouver","Quebec City","Halifax"], answer:0, hint:"west coast + British Columbia", explain:"That is Vancouver." },
    { key:"l2", role:"Guide", prompt:"Listen. Which destination is it?",
      say:"It is in Alberta in western Canada. It is famous for the Rocky Mountains and Lake Louise. You can hike in summer or ski in winter.",
      choices:["Toronto","Banff & Lake Louise","Ottawa"], answer:1, hint:"Rocky Mountains + Lake Louise", explain:"That is Banff and Lake Louise." },
    { key:"l3", role:"Guide", prompt:"Listen. Which destination is it?",
      say:"It is a historic city in Quebec along the St. Lawrence River. In winter it can be romantic with snow and lights.",
      choices:["Montréal","Quebec City","Niagara Falls"], answer:1, hint:"historic + St. Lawrence River", explain:"That is Quebec City." }
  ];

  // Build everything
  setVoice("en-US");
  renderVibeTags();
  renderDestinations();
  renderShortlist();
  renderPlanSelects();
  renderActivityChips();

  const grammarAPI = makeMCQ($("#grammarMCQHost"), grammarMCQ, "gram");
  safeOn("#btnGrammarMCQReset","click", () => grammarAPI.reset());

  const adjAPI = buildSort($("#adjSortHost"), adjCategories, adjItems, "adj");
  safeOn("#btnAdjSortReset","click", () => adjAPI.reset());

  const compAPI = makeMCQ($("#compMCQHost"), compMCQ, "comp");
  safeOn("#btnCompMCQReset","click", () => compAPI.reset());

  const compBuilderAPI = buildWordOrder($("#compBuilderHost"), compBuilderItems, "compBuild");
  safeOn("#btnCompBuilderReset","click", () => compBuilderAPI.reset());

  const dialogueAPI = buildListening($("#dialogueHost"), dialogueItems, "dialogue");
  safeOn("#btnDialogueReset","click", () => dialogueAPI.reset());

  const suggestAPI = buildWordOrder($("#suggestBuilderHost"), suggestBuilderItems, "suggest");
  safeOn("#btnSuggestBuilderReset","click", () => suggestAPI.reset());

  const listenAPI = buildListening($("#listenHost"), listenItems, "listen");
  safeOn("#btnListenReset","click", () => listenAPI.reset());

  safeOn("#btnResetAll","click", () => {
    if(!confirm("Reset ALL activities and score?")) return;
    Speech.stop();
    Score.reset();

    state.search=""; state.region="all"; state.season="all"; state.sort="recommended"; state.vibe=null;
    const s=$("#searchBox"), r=$("#regionSelect"), se=$("#seasonSelect"), so=$("#sortSelect");
    if(s) s.value=""; if(r) r.value="all"; if(se) se.value="all"; if(so) so.value="recommended";
    renderVibeTags(); renderDestinations();

    state.shortlist.clear(); renderShortlist();

    grammarAPI.reset(); adjAPI.reset(); compAPI.reset(); compBuilderAPI.reset();
    dialogueAPI.reset(); suggestAPI.reset(); listenAPI.reset();

    planState.acts.clear(); renderActivityChips();
    const out=$("#planOutput"); if(out) out.value="";
    const fb=$("#planFeedback"); if(fb) fb.classList.add("hidden");
    const cl=$("#planChecklist"); if(cl) cl.innerHTML="";

    $("#top")?.scrollIntoView({behavior:"smooth"});
  });

  const max =
    3 + 2 + grammarMCQ.length + adjItems.length + compMCQ.length +
    (compBuilderItems.length*2) + dialogueItems.length + (suggestBuilderItems.length*2) + 5 + listenItems.length;

  Score.setMax(max);
})();