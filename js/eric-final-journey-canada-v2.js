/* SpeakEasyTisha — Eric Final Celebration + Lesson Library (v2)
Build: 20260526-155209
*/
(() => {
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const DEBUG=$("#debugBox");
  const log=(m)=>{ try{DEBUG.classList.remove("hidden"); DEBUG.textContent += "\n"+m;}catch(e){} };
  window.addEventListener("error",(e)=>log("[Error] "+e.message+" @ "+e.filename+":"+e.lineno));
  window.addEventListener("unhandledrejection",(e)=>log("[Promise] "+String(e.reason)));

  const esc=(s)=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const norm=(s)=>String(s??"").toLowerCase().replace(/[’]/g,"'").replace(/\s+/g," ").trim();
  const shuffle=(a)=>{a=(a||[]).slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
  const tap=(el, fn)=>{ if(!el) return; let last=0;
    const h=(e)=>{const now=Date.now(); if(now-last<320) return; last=now; try{fn(e);}catch(err){console.error(err); log(String(err));}};
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h);} else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  };

  const LESSONS = [{"date": "12/11/2025", "title": "Introduction", "primary": "https://docs.google.com/presentation/d/141b1lW710gG97Hpn4zyQ_9yg3N9w-QJu/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "links": ["https://docs.google.com/presentation/d/141b1lW710gG97Hpn4zyQ_9yg3N9w-QJu/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "category": "Other", "skills": ["Lesson"]}, {"date": "19/11/2025", "title": "Airport 1", "primary": "https://docs.google.com/presentation/d/1CZ5Iabvor6-inJE41mjuT69Ibo_hifyu/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true", "links": ["https://docs.google.com/presentation/d/1CZ5Iabvor6-inJE41mjuT69Ibo_hifyu/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"], "category": "Airport", "skills": ["Travel"]}, {"date": "26/11/2025", "title": "Airport 2", "primary": "https://docs.google.com/presentation/d/13qXn8jD877it5mNDSJSbct6RaC666_7d/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true", "links": ["https://docs.google.com/presentation/d/13qXn8jD877it5mNDSJSbct6RaC666_7d/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"], "category": "Airport", "skills": ["Travel"]}, {"date": "03/12/2025", "title": "Airport 3", "primary": "https://docs.google.com/presentation/d/1iA--54wWtl6jxMVA6cPKDoJdK_Rywg1U/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true", "links": ["https://docs.google.com/presentation/d/1iA--54wWtl6jxMVA6cPKDoJdK_Rywg1U/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"], "category": "Airport", "skills": ["Travel"]}, {"date": "10/12/2025", "title": "Self-Introduction", "primary": "https://speakeasytisha.github.io/eric-airport-selfintro.html", "links": ["https://speakeasytisha.github.io/eric-airport-selfintro.html"], "category": "Other", "skills": ["Interactive"]}, {"date": "23/12/2025", "title": "Basic Conversation", "primary": "https://speakeasytisha.github.io/eric-family-smalltalk", "links": ["https://speakeasytisha.github.io/eric-family-smalltalk"], "category": "Conversation studio", "skills": ["Interactive", "Speaking"]}, {"date": "30/12/2025", "title": "Numbers", "primary": "https://speakeasytisha.github.io/numbers-masterclass/index", "links": ["https://speakeasytisha.github.io/numbers-masterclass/index"], "category": "Numbers & spelling", "skills": ["Interactive", "Numbers"]}, {"date": "08/01/2026", "title": "Hotel", "primary": "https://speakeasytisha.github.io/canada-hotel-intro.html", "links": ["https://speakeasytisha.github.io/canada-hotel-intro.html"], "category": "Hotel", "skills": ["Interactive", "Travel"]}, {"date": "13/01/2026", "title": "Hotel/Present Perfect", "primary": "https://speakeasytisha.github.io/canada-hotel-followup", "links": ["https://speakeasytisha.github.io/canada-hotel-followup"], "category": "Hotel", "skills": ["Interactive", "Travel"]}, {"date": "21/01/2026", "title": "Hotel/Oral Practice", "primary": "https://speakeasytisha.github.io/sfo-hotel-final-session", "links": ["https://speakeasytisha.github.io/sfo-hotel-final-session"], "category": "Hotel", "skills": ["Interactive", "Speaking", "Travel"]}, {"date": "04/03/2026", "title": "Hotel → City Quest", "primary": "https://speakeasytisha.github.io/hotel-to-city-quest-PUBLISH.html", "links": ["https://speakeasytisha.github.io/hotel-to-city-quest-PUBLISH.html"], "category": "Hotel", "skills": ["Interactive", "Travel"]}, {"date": "11/03/2026", "title": "Next trip planner", "primary": "https://speakeasytisha.github.io/next-trip-lesson", "links": ["https://speakeasytisha.github.io/canada-trip-planner-quest.html", "https://speakeasytisha.github.io/next-trip-lesson"], "category": "Canada discovery", "skills": ["Interactive"]}, {"date": "18/03/2026", "title": "Canada Summer Quest", "primary": "https://speakeasytisha.github.io/canada-summer-quest.html", "links": ["https://speakeasytisha.github.io/canada-summer-quest.html"], "category": "Canada discovery", "skills": ["Interactive", "Travel"]}, {"date": "25/03/2026", "title": "Oral Practice Quest 🇨🇦", "primary": "https://speakeasytisha.github.io/canada-oral-practice-quest.html", "links": ["https://speakeasytisha.github.io/canada-oral-practice-quest-v2.html", "https://speakeasytisha.github.io/canada-oral-practice-quest.html"], "category": "Speaking practice", "skills": ["Interactive", "Speaking"]}, {"date": "01/04/2026", "title": "What not to miss in Canada 🇨🇦", "primary": "https://speakeasytisha.github.io/canada-must-see-speaking-quest-v5.html", "links": ["https://speakeasytisha.github.io/canada-must-see-speaking-quest-v5.html"], "category": "Canada discovery", "skills": ["Interactive", "Travel"]}, {"date": "08/04/2026", "title": "Numbers/Letters", "primary": "https://speakeasytisha.github.io/numbers-masterclass-addon.html", "links": ["https://speakeasytisha.github.io/numbers-masterclass-addon.html"], "category": "Numbers & spelling", "skills": ["Interactive", "Numbers"]}, {"date": "29/04/2026", "title": "Eric’s Holland Trip Review Quest", "primary": "https://speakeasytisha.github.io/holland-trip-review-eric.html", "links": ["https://speakeasytisha.github.io/holland-trip-review-eric.html"], "category": "Trip review & storytelling", "skills": ["Interactive"]}, {"date": "15/05/2026", "title": "Canada Speaking Quest", "primary": "https://speakeasytisha.github.io/eric-canada-speaking-quest-lesson2.html", "links": ["https://speakeasytisha.github.io/eric-canada-speaking-quest-lesson2.html"], "category": "Speaking practice", "skills": ["Interactive", "Speaking", "Travel"]}, {"date": "20/05/2026", "title": "Money", "primary": "https://speakeasytisha.github.io/canada-verb-tense-switch-studio-a1a2.html", "links": ["https://speakeasytisha.github.io/canada-money-payment-addon-a1a2.html", "https://speakeasytisha.github.io/canada-verb-tense-switch-studio-a1a2.html"], "category": "Money & paying", "skills": ["Interactive", "Money"]}];
  const SCENARIOS = [{"id": "airport", "label": "At the airport (check‑in)", "desc": "Check-in, baggage, seat, gate. Calm and polite.", "phrases": ["boarding pass", "checked bag", "carry-on", "aisle seat / window seat", "gate", "passport"], "lines": [{"who": "Agent", "side": "a", "say": "Good morning. Where are you flying today?"}, {"who": "You", "side": "b", "say": "Good morning. I’m flying to Toronto."}, {"who": "Agent", "side": "a", "say": "Do you have a checked bag?"}, {"who": "You", "side": "b", "say": "Yes, one suitcase, please."}, {"who": "Agent", "side": "a", "say": "Here is your boarding pass. Your gate is B12."}, {"who": "You", "side": "b", "say": "Thank you. What time does boarding start?"}], "builder": {"greeting": ["Good morning.", "Hello.", "Good evening."], "request": ["I’d like to check in, please.", "Could you help me check in, please?", "I’d like to check a bag, please."], "detail": ["I’m flying to Toronto.", "It’s one suitcase.", "I’d like a window seat, please."], "end": ["Thank you.", "Thanks a lot.", "Thank you very much."]}, "checks": ["check in", "bag|suitcase|boarding pass|gate|seat|flying"], "quiz": [["What is the gate?", "B12", "A3", "C7", 0], ["How many checked bags?", "one", "two", "none", 0], ["Destination?", "Toronto", "Vancouver", "Montreal", 0]]}, {"id": "plane", "label": "On the plane", "desc": "Simple requests: water, blanket, seat, thanks.", "phrases": ["bottled water", "blanket", "seat belt", "aisle", "window", "excuse me"], "lines": [{"who": "Flight attendant", "side": "a", "say": "Hello. Would you like something to drink?"}, {"who": "You", "side": "b", "say": "Yes, please. Could I have bottled water?"}, {"who": "Flight attendant", "side": "a", "say": "Of course. Anything else?"}, {"who": "You", "side": "b", "say": "Could I have a blanket, please? Thank you."}], "builder": {"greeting": ["Hello.", "Excuse me.", "Hi."], "request": ["Could I have bottled water, please?", "Could I have a blanket, please?", "Could I change seats, please?"], "detail": ["Thank you.", "That’s perfect, thank you.", "If possible, a window seat."], "end": ["Thanks.", "Thank you very much.", "Have a nice day."]}, "checks": ["could i have|bottled water|blanket|seat"], "quiz": [["What does he ask for?", "bottled water", "coffee", "juice", 0], ["He also asks for…", "a blanket", "a ticket", "a taxi", 0], ["Tone is…", "polite", "rude", "angry", 0]]}, {"id": "customs", "label": "Going through customs", "desc": "Purpose, length of stay, where you stay.", "phrases": ["purpose of your trip", "how long", "business / tourism", "address", "hotel reservation"], "lines": [{"who": "Officer", "side": "a", "say": "Hello. What is the purpose of your trip?"}, {"who": "You", "side": "b", "say": "Tourism. I’m here for a vacation."}, {"who": "Officer", "side": "a", "say": "How long are you staying in Canada?"}, {"who": "You", "side": "b", "say": "Two weeks. I’m staying in a hotel in Toronto."}, {"who": "Officer", "side": "a", "say": "Great. Enjoy your stay."}, {"who": "You", "side": "b", "say": "Thank you. Have a nice day."}], "builder": {"greeting": ["Hello.", "Good morning.", "Good afternoon."], "request": ["I’m here for tourism.", "I’m here on vacation.", "I’m visiting Canada for a trip."], "detail": ["I’m staying for two weeks.", "I’m staying in a hotel in Toronto.", "Here is my hotel reservation."], "end": ["Thank you.", "Thank you very much.", "Have a nice day."]}, "checks": ["tourism|vacation|staying|hotel|weeks|reservation"], "quiz": [["Purpose of trip?", "tourism", "work", "school", 0], ["How long?", "two weeks", "two days", "two months", 0], ["Where is he staying?", "hotel", "with family", "camping", 0]]}, {"id": "taxi", "label": "In a taxi to the hotel", "desc": "Address, time, price estimate.", "phrases": ["to this address", "how long", "about how much", "could you take me", "please"], "lines": [{"who": "Driver", "side": "a", "say": "Hi. Where to?"}, {"who": "You", "side": "b", "say": "Hello. Could you take me to this hotel, please?"}, {"who": "Driver", "side": "a", "say": "Sure. Do you have an address?"}, {"who": "You", "side": "b", "say": "Yes, it’s at 111 Princes' Boulevard. How long does it take?"}], "builder": {"greeting": ["Hello.", "Hi.", "Good evening."], "request": ["Could you take me to this hotel, please?", "Could you take me downtown, please?", "Could you take me to this address, please?"], "detail": ["Here is the address.", "How long does it take?", "About how much is it?"], "end": ["Thank you.", "Thanks.", "Thank you very much."]}, "checks": ["take me|address|how long|how much|hotel"], "quiz": [["He asks the driver to…", "take him to a hotel", "sell a ticket", "find a gate", 0], ["Driver asks for…", "an address", "a passport", "a menu", 0], ["He asks about…", "time", "weather", "food", 0]]}, {"id": "hotel", "label": "At hotel reception (check‑in)", "desc": "Reservation, ID, breakfast, bottled water.", "phrases": ["I have a reservation", "check-in time", "breakfast included", "ID", "room key"], "lines": [{"who": "Reception", "side": "a", "say": "Hello! Welcome. How can I help you?"}, {"who": "You", "side": "b", "say": "Hello. I have a reservation under Eric Foulonneau."}, {"who": "Reception", "side": "a", "say": "Great. Can I see your passport, please?"}, {"who": "You", "side": "b", "say": "Of course. Is breakfast included?"}, {"who": "Reception", "side": "a", "say": "Yes, it is. Here is your room key."}, {"who": "You", "side": "b", "say": "Thank you. Is there any bottled water in the room?"}], "builder": {"greeting": ["Hello.", "Good evening.", "Good afternoon."], "request": ["I have a reservation under Eric.", "I’d like to check in, please.", "Could I have a quiet room, please?"], "detail": ["Is breakfast included?", "Is there bottled water in the room?", "What time is check‑out?"], "end": ["Thank you.", "Thanks a lot.", "Thank you very much."]}, "checks": ["reservation|check in|breakfast|passport|room key|bottled water"], "quiz": [["Reception asks for…", "passport", "menu", "taxi", 0], ["Breakfast is…", "included", "not included", "unknown", 0], ["He asks about…", "bottled water", "boarding", "gate", 0]]}, {"id": "restaurant", "label": "At a restaurant", "desc": "Polite ordering + bill.", "phrases": ["Could I have…", "I’d like…", "the bill, please", "bottled water", "thank you"], "lines": [{"who": "Server", "side": "a", "say": "Good evening. Are you ready to order?"}, {"who": "You", "side": "b", "say": "Yes, please. I’d like the salmon, and bottled water."}, {"who": "Server", "side": "a", "say": "Of course. Anything else?"}, {"who": "You", "side": "b", "say": "That’s all, thank you."}, {"who": "Server", "side": "a", "say": "Would you like the bill?"}, {"who": "You", "side": "b", "say": "Yes, please. Could I have the bill, please?"}], "builder": {"greeting": ["Good evening.", "Hello.", "Hi."], "request": ["I’d like the salmon, please.", "Could I have bottled water, please?", "Could I have the bill, please?"], "detail": ["That’s all, thank you.", "Do you have a vegetarian option?", "Can I pay by card?"], "end": ["Thank you.", "Thanks.", "Have a nice evening."]}, "checks": ["i'd like|could i have|bill|bottled water"], "quiz": [["He orders…", "salmon", "pizza", "coffee", 0], ["He drinks…", "bottled water", "soda", "tea", 0], ["He asks for…", "the bill", "a passport", "a taxi", 0]]}, {"id": "tickets", "label": "Getting tickets / paying", "desc": "Tickets, price, tax, receipt.", "phrases": ["one ticket", "price", "tax included", "total after tax", "receipt"], "lines": [{"who": "Clerk", "side": "a", "say": "Hello. How can I help you?"}, {"who": "You", "side": "b", "say": "Hello. I’d like one ticket to the museum, please."}, {"who": "Clerk", "side": "a", "say": "That’s twenty dollars. Tax is added."}, {"who": "You", "side": "b", "say": "Okay. What’s the total after tax?"}, {"who": "Clerk", "side": "a", "say": "It’s twenty-two dollars. Would you like a receipt?"}, {"who": "You", "side": "b", "say": "Yes, please. Thank you."}], "builder": {"greeting": ["Hello.", "Good morning.", "Good afternoon."], "request": ["I’d like one ticket, please.", "I’d like two tickets, please.", "Could I have a receipt, please?"], "detail": ["What’s the price?", "Is tax included?", "What’s the total after tax?"], "end": ["Thank you.", "Thanks a lot.", "Thank you very much."]}, "checks": ["ticket|total after tax|tax included|receipt|price"], "quiz": [["Ticket is for…", "museum", "hotel", "plane", 0], ["Total after tax is…", "22 dollars", "20 dollars", "12 dollars", 0], ["He asks about…", "total after tax", "breakfast", "gate", 0]]}];

  // TTS
  const KEYS={lang:"eric_final_lang", voice:"eric_final_voice", auto:"eric_final_auto", lvl:"eric_final_lvl", sc:"eric_final_sc"};
  const TTS={
    lang: localStorage.getItem(KEYS.lang)||"en-US",
    voiceName: localStorage.getItem(KEYS.voice)||"",
    auto: (localStorage.getItem(KEYS.auto)==="1"),
    voices: [],
    async loadVoices(){
      if(!window.speechSynthesis) return [];
      const got=window.speechSynthesis.getVoices()||[];
      if(got.length){this.voices=got; return got;}
      return await new Promise((resolve)=>{
        window.speechSynthesis.onvoiceschanged=()=>{this.voices=window.speechSynthesis.getVoices()||[]; resolve(this.voices);};
        setTimeout(()=>resolve(this.voices),900);
      });
    },
    pick(){
      const v=this.voices.length?this.voices:(window.speechSynthesis?.getVoices?.()||[]);
      if(this.voiceName){ const by=v.find(x=>x.name===this.voiceName); if(by) return by; }
      const lang=(this.lang||"en-US").toLowerCase();
      let best=v.find(x=>(x.lang||"").toLowerCase()===lang);
      if(!best) best=v.find(x=>(x.lang||"").toLowerCase().startsWith(lang));
      if(!best) best=v.find(x=>(x.lang||"").toLowerCase().startsWith("en"));
      return best||null;
    },
    setLang(l){ this.lang=l; localStorage.setItem(KEYS.lang,l); },
    setVoiceName(n){ this.voiceName=n||""; localStorage.setItem(KEYS.voice,this.voiceName); },
    setAuto(on){ this.auto=!!on; localStorage.setItem(KEYS.auto,this.auto?"1":"0"); },
    stop(){ try{window.speechSynthesis.cancel();}catch(e){} },
    say(t){
      if(!window.speechSynthesis) return;
      try{window.speechSynthesis.cancel();}catch(e){}
      const u=new SpeechSynthesisUtterance(String(t||""));
      u.lang=this.lang||"en-US";
      const v=this.pick(); if(v) u.voice=v;
      u.rate=0.97; u.pitch=1.0;
      window.speechSynthesis.speak(u);
    }
  };

  function syncAccent(){
    if(TTS.lang==="en-US"){ $("#voiceUS").classList.add("is-on"); $("#voiceUK").classList.remove("is-on"); }
    else { $("#voiceUK").classList.add("is-on"); $("#voiceUS").classList.remove("is-on"); }
  }
  function syncAuto(){
    if(TTS.auto){ $("#autoOn").classList.add("is-on"); $("#autoOff").classList.remove("is-on"); }
    else { $("#autoOff").classList.add("is-on"); $("#autoOn").classList.remove("is-on"); }
  }
  async function buildVoiceSelect(){
    await TTS.loadVoices();
    const sel=$("#voiceSelect"); sel.innerHTML="";
    const o0=document.createElement("option"); o0.value=""; o0.textContent="Auto (best match)"; sel.appendChild(o0);
    const sorted=(TTS.voices||[]).slice().sort((a,b)=>{
      const ae=(a.lang||"").toLowerCase().startsWith("en")?0:1;
      const be=(b.lang||"").toLowerCase().startsWith("en")?0:1;
      if(ae!==be) return ae-be;
      return (a.lang||"").localeCompare(b.lang||"") || (a.name||"").localeCompare(b.name||"");
    });
    sorted.forEach(v=>{const o=document.createElement("option"); o.value=v.name; o.textContent=`${v.name} — ${v.lang}`; sel.appendChild(o);});
    sel.value=TTS.voiceName||"";
  }

  // Score (final mission only)
  const Score={now:0,max:0,awarded:new Set(),
    setMax(n){this.max=n; updScore();},
    award(k,pts=1){ if(this.awarded.has(k)) return; this.awarded.add(k); this.now+=pts; updScore(); },
    reset(){ this.now=0; this.awarded.clear(); updScore(); }
  };
  function updScore(){
    $("#scoreNow").textContent=String(Score.now);
    $("#scoreMax").textContent=String(Score.max);
    const pct=Score.max?Math.round((Score.now/Score.max)*100):0;
    $("#progressBar").style.width=Math.max(0,Math.min(100,pct))+"%";
  }

  // ---------- Stats ----------
  function renderStats(){
    const dates = LESSONS.map(x=>x.date);
    const first=dates[0]||"—", last=dates[dates.length-1]||"—";
    const cats = Array.from(new Set(LESSONS.map(x=>x.category))).sort();
    const li = $("#statsList");
    li.innerHTML = `
      <li><strong>${LESSONS.length}</strong> lessons in your library (${first} → ${last})</li>
      <li><strong>${cats.length}</strong> categories (airport, hotel, speaking, numbers, …)</li>
      <li>Key wins: check-in, ordering, directions, tickets, phone numbers, confident speaking</li>
      <li>Final mission today: <strong>introduce yourself clearly</strong> + <strong>real scenarios</strong></li>
    `;
  }

  // ---------- Library ----------
  const STATE={cat:"All", skill:"All", q:""};
  function allCats(){ return ["All", ...Array.from(new Set(LESSONS.map(x=>x.category))).sort()]; }
  function allSkills(){
    const s=new Set();
    LESSONS.forEach(l=> (l.skills||[]).forEach(x=>s.add(x)));
    return ["All", ...Array.from(s).sort()];
  }
  function renderFilters(){
    const c=$("#catPick");
    c.innerHTML = allCats().map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");
    c.value=STATE.cat;
    c.addEventListener("change",()=>{STATE.cat=c.value; renderLibrary();});
    const s=$("#skillPick");
    s.innerHTML = allSkills().map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");
    s.value=STATE.skill;
    s.addEventListener("change",()=>{STATE.skill=s.value; renderLibrary();});
    $("#q").addEventListener("input",(e)=>{STATE.q=e.target.value; renderLibrary();});
    tap($("#btnClear"),()=>{
      STATE.cat="All"; STATE.skill="All"; STATE.q="";
      c.value="All"; s.value="All"; $("#q").value="";
      renderLibrary();
    });
  }
  function linkLabel(url){
    if(url.includes("docs.google.com")) return "Slides";
    if(url.includes("speakeasytisha.github.io")) return "Open";
    return "Link";
  }
  function renderLibrary(){
    const grid=$("#lessonGrid"); grid.innerHTML="";
    const q=norm(STATE.q);
    const items=LESSONS.filter(l=>{
      if(STATE.cat!=="All" && l.category!==STATE.cat) return false;
      if(STATE.skill!=="All" && !(l.skills||[]).includes(STATE.skill)) return false;
      if(q){
        const hay = norm(`${l.date} ${l.title} ${l.category} ${(l.skills||[]).join(" ")} ${(l.links||[]).join(" ")}`);
        if(!hay.includes(q)) return false;
      }
      return true;
    });
    if(!items.length){
      grid.innerHTML = `<div class="kcard">No results. Try another filter.</div>`;
      return;
    }
    items.forEach(l=>{
      const card=document.createElement("div");
      card.className="lessonCard";
      card.innerHTML = `
        <div class="lessonTop">
          <div>
            <div class="lessonTitle">${esc(l.title)}</div>
            <div class="tiny" style="color:rgba(15,31,38,.72)">${esc(l.date)} · ${esc(l.category)}</div>
          </div>
          <div class="lessonMeta">
            ${(l.skills||[]).slice(0,3).map(s=>`<span class="badge">${esc(s)}</span>`).join("")}
          </div>
        </div>
        <div class="lessonLinks">
          ${(l.links||[]).slice(0,4).map(u=>`<a class="toolmini" href="${esc(u)}" target="_blank" rel="noopener">${esc(linkLabel(u))}</a>`).join("")}
        </div>
      `;
      tap(card,(e)=>{
        if(e?.target?.closest("a")) return;
        if(l.primary) window.open(l.primary, "_blank", "noopener");
      });
      grid.appendChild(card);
    });
  }

  // ---------- Present yourself: models + builder ----------
  const MODELS={
    A1:`My name is Eric. I am (age) years old. I live in (city). I am French. I work as a (job). I’m going to Canada next summer.`,
    A2:`Hello, my name is Eric. I’m (age) years old and I live in (city), in France. I work as a (job). I’m going to Canada next summer, and I’d like to visit different places.`,
    B1:`Hello! My name is Eric. I’m (age) years old and I live in (city), France. I work as a (job). Next summer, I’m going to travel around Canada. I’m really excited because I want to discover the cities, the nature, and the local food.`
  };
  let lvl = localStorage.getItem(KEYS.lvl) || "A1";
  function setLvl(x){
    lvl=x; localStorage.setItem(KEYS.lvl,x);
    $("#lvlA1").classList.toggle("is-on", x==="A1");
    $("#lvlA2").classList.toggle("is-on", x==="A2");
    $("#lvlB1").classList.toggle("is-on", x==="B1");
    $("#modelBox").textContent = MODELS[x];
    updateOut();
  }

  function renderBuilder(){
    const host=$("#builder");
    host.innerHTML = `
      <div class="badge">Build your intro</div>
      <div class="smallrow" style="margin-top:.55rem">
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">Name</label>
        <select class="select" id="bName">
          <option>Eric</option><option>(your name)</option>
        </select>
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">Age</label>
        <select class="select" id="bAge">
          <option>(age)</option><option>40</option><option>45</option><option>50</option><option>55</option><option>60</option>
        </select>
      </div>
      <div class="smallrow">
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">City</label>
        <select class="select" id="bCity">
          <option>(city)</option><option>Challans</option><option>Nantes</option><option>Paris</option><option>La Rochelle</option>
        </select>
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">Job</label>
        <select class="select" id="bJob">
          <option>(job)</option><option>engineer</option><option>technician</option><option>manager</option><option>teacher</option><option>salesperson</option>
        </select>
      </div>
      <div class="smallrow">
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">Nationality</label>
        <select class="select" id="bNat">
          <option>French</option><option>Canadian</option><option>American</option><option>British</option>
        </select>
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">Trip plan</label>
        <select class="select" id="bPlan">
          <option>visit Canada</option><option>travel around Canada</option><option>visit Toronto</option><option>visit cities and nature</option><option>discover local food</option>
        </select>
      </div>
    `;
    ["bName","bAge","bCity","bJob","bNat","bPlan"].forEach(id=>$("#"+id).addEventListener("change", updateOut));
  }

  function updateOut(){
    const name=$("#bName")?.value || "Eric";
    const age=$("#bAge")?.value || "(age)";
    const city=$("#bCity")?.value || "(city)";
    const job=$("#bJob")?.value || "(job)";
    const nat=$("#bNat")?.value || "French";
    const plan=$("#bPlan")?.value || "visit Canada";

    let out="";
    if(lvl==="A1"){
      out = `My name is ${name}. I am ${age} years old. I live in ${city}. I am ${nat}. I work as a ${job}. I’m going to Canada next summer.`;
    } else if(lvl==="A2"){
      out = `Hello, my name is ${name}. I’m ${age} years old and I live in ${city}, in France. I work as a ${job}. I’m going to ${plan} next summer.`;
    } else {
      out = `Hello! My name is ${name}. I’m ${age} years old and I live in ${city}, France. I work as a ${job}. Next summer, I’m going to ${plan}. I’m excited because I want to discover new places and practise my English.`;
    }
    $("#out").textContent = out;
  }

  function checkOut(){
    const t=$("#out").textContent;
    const hasName=/my name is/i.test(t);
    const hasLive=/live in/i.test(t);
    const hasTrip=/going to/i.test(t);
    const hasPolite=/hello|hi/i.test(t) || lvl==="A1";
    let ok=hasName && hasLive && hasTrip;
    let msg="✅ Great!";
    if(!hasName) {ok=false; msg="❌ Add: My name is…";}
    else if(!hasLive) {ok=false; msg="❌ Add: I live in…";}
    else if(!hasTrip) {ok=false; msg="❌ Add: I’m going to Canada next summer.";}
    const fb=$("#outFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no"); fb.textContent=msg;
    if(ok) Score.award("builder",8);
  }

  // ---------- Quick practice (MCQ + dropdown) ----------
  const MCQ = [
    {id:"m1", p:"Choose the best question:","choices":["What’s your name?","What your name is?","Name you?"], a:0, h:"What’s your name?"},
    {id:"m2", p:"Choose the best answer: Where do you live?","choices":["I live in Nantes.","I am live Nantes.","I living in Nantes."], a:0, h:"I live in…"},
    {id:"m3", p:"Choose the best: (job)","choices":["I work as a technician.","I work a technician.","I am work technician."], a:0, h:"work as a…"},
    {id:"m4", p:"Choose the best: nationality","choices":["I am French.","I have French.","I’m France."], a:0, h:"I am + nationality"},
  ];
  const DD = [
    {id:"d1", p:"Complete: My name ___ Eric.", opts:["is","are","am"], a:0, h:"My name is…"},
    {id:"d2", p:"Complete: I ___ 45 years old.", opts:["am","is","are"], a:0, h:"I am…"},
    {id:"d3", p:"Complete: I live ___ France.", opts:["in","on","at"], a:0, h:"in + country"},
    {id:"d4", p:"Complete: What ___ you do?", opts:["do","are","did"], a:0, h:"What do you do?"},
  ];
  const P={idx:0};
  function renderPractice(){
    const m=MCQ[P.idx % MCQ.length];
    const d=DD[P.idx % DD.length];
    $("#mcqHost").innerHTML = `<div class="badge">MCQ</div><div style="margin-top:.35rem"><strong>${esc(m.p)}</strong></div>`+
      m.choices.map((c,i)=>`<label class="choice"><input type="radio" name="mcq" value="${i}"/><div>${esc(c)}</div></label>`).join("");
    $("#ddHost").innerHTML = `<div class="badge red">Dropdown</div><div style="margin-top:.35rem"><strong>${esc(d.p)}</strong></div>`+
      `<select class="select" id="ddSel">${d.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>`;
  }
  function startPractice(){ P.idx=0; renderPractice(); $("#fb").classList.add("hidden"); }
  function nextPractice(){ P.idx++; renderPractice(); $("#fb").classList.add("hidden"); }
  function hintPractice(){
    const m=MCQ[P.idx % MCQ.length];
    const d=DD[P.idx % DD.length];
    const fb=$("#fb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
    fb.textContent="💡 "+m.h+" / "+d.h;
  }
  function checkPractice(){
    const m=MCQ[P.idx % MCQ.length];
    const d=DD[P.idx % DD.length];
    let ok=0, total=2;

    const c=document.querySelector('input[name="mcq"]:checked');
    if(c && parseInt(c.value,10)===m.a){ ok++; Score.award("mcq:"+m.id,2); }
    const val=parseInt($("#ddSel").value,10);
    if(val===d.a){ ok++; Score.award("dd:"+d.id,2); }

    const fb=$("#fb"); fb.classList.remove("hidden","ok","no");
    const allOk = ok===total;
    fb.classList.add(allOk?"ok":"no");
    fb.textContent = allOk ? "✅ Perfect!" : `❌ You got ${ok}/${total}. Use Hint.`;
  }
  function resetPractice(){ startPractice(); Score.reset(); }

  // ---------- Scenario Dialogue Studio ----------
  const ScState = {
    id: localStorage.getItem(KEYS.sc) || SCENARIOS[0].id,
    show:false
  };
  function curSc(){ return SCENARIOS.find(s=>s.id===ScState.id) || SCENARIOS[0]; }

  function renderScenarioPick(){
    const sel=$("#scPick");
    sel.innerHTML = SCENARIOS.map(s=>`<option value="${esc(s.id)}">${esc(s.label)}</option>`).join("");
    sel.value = ScState.id;
    sel.addEventListener("change", ()=>{
      ScState.id = sel.value;
      localStorage.setItem(KEYS.sc, ScState.id);
      ScState.show = false;
      renderScenario();
      renderScBuilder();
      renderScQuiz();
      $("#scQFb").classList.add("hidden");
      $("#scBFb").classList.add("hidden");
    });
  }

  function renderScenario(){
    const d = curSc();
    const host = $("#scDialogue");
    host.innerHTML = "";
    d.lines.forEach(ln=>{
      const b=document.createElement("div");
      b.className="bubble "+(ln.side==="a"?"a":"b");
      b.innerHTML = `<div class="who">${ln.side==="a"?"🟦":"🟩"} ${esc(ln.who)}</div>
        <div class="txt">${ScState.show?esc(ln.say):"<span class='badge'>Hidden</span>"}</div>
        <div class="tools"><button class="toolmini" data-act="s">🔊 Listen</button></div>`;
      tap(b.querySelector('[data-act="s"]'),()=>TTS.say(ln.say));
      host.appendChild(b);
    });

    const p=$("#scPhrases");
    p.innerHTML = d.phrases.map(x=>`<span class="token">${esc(x)}</span>`).join("");
  }

  function scPlayAll(){
    const d=curSc(); let i=0;
    const next=()=>{ if(i>=d.lines.length) return; TTS.say(d.lines[i].say); i++; setTimeout(next, 1750); };
    next();
  }
  function scShow(){ ScState.show=true; renderScenario(); }
  function scHide(){ ScState.show=false; renderScenario(); }

  function renderScBuilder(){
    const d=curSc();
    const host=$("#scBuilder");
    host.innerHTML = `
      <div class="smallrow">
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">Greeting</label>
        <select class="select" id="scG">${d.builder.greeting.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
      </div>
      <div class="smallrow">
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">Request</label>
        <select class="select" id="scR">${d.builder.request.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
      </div>
      <div class="smallrow">
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">Detail</label>
        <select class="select" id="scD">${d.builder.detail.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
      </div>
      <div class="smallrow">
        <label class="tiny" style="color:rgba(15,31,38,.72);font-weight:950">End</label>
        <select class="select" id="scE">${d.builder.end.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
      </div>
    `;
    ["scG","scR","scD","scE"].forEach(id=>$("#"+id).addEventListener("change", updateScOut));
    updateScOut();
  }

  function updateScOut(){
    const g=$("#scG").value, r=$("#scR").value, de=$("#scD").value, e=$("#scE").value;
    let out = `${g} ${r} ${de} ${e}`.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    $("#scBOut").textContent = out;
  }
  function scBListen(){
    const t=$("#scBOut").textContent.trim();
    if(t) TTS.say(t);
  }
  function scBReset(){
    renderScBuilder();
    $("#scBFb").classList.add("hidden");
  }
  function scBCheck(){
    const d=curSc();
    const t = ($("#scBOut").textContent||"").toLowerCase();
    const patterns = d.checks || [];
    let ok = false;
    for(const p of patterns){
      const rx = new RegExp(p, "i");
      if(rx.test(t)){ ok=true; break; }
    }
    const polite = /please|thank/i.test(t);
    ok = ok && polite;
    const fb=$("#scBFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok?"ok":"no");
    fb.textContent = ok ? "✅ Great! Natural and polite." : "❌ Add a key phrase for this scenario + a polite ending (please/thank you).";
    if(ok) Score.award("scenario_builder:"+d.id, 6);
  }

  function renderScQuiz(){
    const d=curSc();
    const host=$("#scQuiz");
    host.innerHTML = d.quiz.map((q,i)=>`<div class="kcard" style="margin-top:.45rem">
      <div><strong>Q${i+1}:</strong> ${esc(q[0])}</div>
      ${[q[1],q[2],q[3]].map((c,ci)=>`<label class="choice"><input type="radio" name="scq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")}
    </div>`).join("");
    host.dataset.qset = JSON.stringify(d.quiz);
  }
  function scQReset(){ renderScQuiz(); $("#scQFb").classList.add("hidden"); }
  function scQCheck(){
    const qset = JSON.parse($("#scQuiz").dataset.qset||"[]");
    let correct=0;
    qset.forEach((q,i)=>{
      const c=document.querySelector(`input[name="scq${i}"]:checked`);
      if(c && parseInt(c.value,10)===q[4]) correct++;
    });
    const fb=$("#scQFb");
    fb.classList.remove("hidden","ok","no");
    const ok = correct>=2;
    fb.classList.add(ok?"ok":"no");
    fb.textContent = `Score: ${correct}/${qset.length}`;
    if(ok) Score.award("scenario_quiz:"+curSc().id, 6);
  }

  function resetAll(){
    TTS.stop();
    Score.reset();
    $("#outFb").classList.add("hidden");
    $("#fb").classList.add("hidden");
    $("#scBFb").classList.add("hidden");
    $("#scQFb").classList.add("hidden");
    startPractice();
    ScState.show=false;
    renderScenario();
    renderScBuilder();
    renderScQuiz();
    document.getElementById("top").scrollIntoView({behavior:"smooth"});
  }

  async function init(){
    Score.setMax(80);
    if(localStorage.getItem(KEYS.auto)===null) TTS.setAuto(false);

    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});
    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});
    tap($("#btnTestVoice"),()=>TTS.say("Hello. What’s your name? My name is Eric. I’m going to Canada next summer."));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnResetAll"),()=>{ if(confirm("Reset this page?")) resetAll(); });

    tap($("#btnGoLibrary"),()=>document.getElementById("secLibrary").scrollIntoView({behavior:"smooth"}));
    tap($("#btnGoFinal"),()=>document.getElementById("secFinal").scrollIntoView({behavior:"smooth"}));

    renderStats();
    renderFilters();
    renderLibrary();

    // Final mission: listens
    tap($("#miniListen"),()=>TTS.say("My name is Eric. I am forty five years old. I live in France. I work as a technician. I am French. I am going to Canada next summer."));
    tap($("#qListen"),()=>TTS.say("What is your name? How old are you? Where do you live? What do you do? What is your nationality?"));

    // Models
    tap($("#modelListen"),()=>TTS.say($("#modelBox").textContent));
    tap($("#lvlA1"),()=>setLvl("A1"));
    tap($("#lvlA2"),()=>setLvl("A2"));
    tap($("#lvlB1"),()=>setLvl("B1"));
    setLvl(lvl);

    // Builder
    renderBuilder();
    updateOut();
    tap($("#outListen"),()=>TTS.say($("#out").textContent));
    tap($("#outCheck"),()=>checkOut());
    tap($("#outReset"),()=>{renderBuilder(); updateOut(); $("#outFb").classList.add("hidden");});

    // Practice
    tap($("#mcqStart"),()=>startPractice());
    tap($("#check"),()=>checkPractice());
    tap($("#next"),()=>nextPractice());
    tap($("#hint"),()=>hintPractice());
    tap($("#reset"),()=>resetPractice());
    startPractice();

    // Scenario studio
    renderScenarioPick();
    renderScenario();
    renderScBuilder();
    renderScQuiz();

    tap($("#scPlayAll"),()=>scPlayAll());
    tap($("#scShow"),()=>scShow());
    tap($("#scHide"),()=>scHide());
    tap($("#scBListen"),()=>scBListen());
    tap($("#scBCheck"),()=>scBCheck());
    tap($("#scBReset"),()=>scBReset());
    tap($("#scQCheck"),()=>scQCheck());
    tap($("#scQReset"),()=>scQReset());

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  init();
})();
