/* SpeakEasyTisha — Canada Oral Practice Quest v2
   Build: 20260325-105826
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  const JS_STATUS = $("#jsStatus");
  const DEBUG = $("#debugBox");
  function logDebug(msg){ try{ if(!DEBUG) return; DEBUG.classList.remove("hidden"); DEBUG.textContent += `\n${msg}`; }catch(e){} }
  window.addEventListener("error", (e) => { if(JS_STATUS) JS_STATUS.textContent="JS: ❌ error"; logDebug(`[Error] ${e.message} @ ${e.filename}:${e.lineno}`); });
  window.addEventListener("unhandledrejection", (e) => { if(JS_STATUS) JS_STATUS.textContent="JS: ❌ promise"; logDebug(`[Promise] ${String(e.reason)}`); });
  function escapeHtml(s){ return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
  function normalize(s){ return String(s??"").replace(/[’']/g,"'").replace(/\s+/g," ").trim().toLowerCase(); }
  function shuffle(arr){ const a=(arr||[]).slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function attachTap(el, handler){ if(!el) return; const h=(e)=>{ try{ handler(e); }catch(err){ console.error(err); logDebug("handler error: " + String(err)); } }; el.addEventListener("click",h); el.addEventListener("pointerup",h); el.addEventListener("touchend",h,{passive:true}); }
  function safeOn(sel, evt, handler){ const el=$(sel); if(!el) return; el.addEventListener(evt, handler); }

  const Speech={ mode:"en-US", rate:0.97,
    getVoices(){ try{ return window.speechSynthesis?.getVoices?.()||[]; }catch(e){ return []; } },
    pickVoice(){ const v=this.getVoices(); const lang=this.mode.toLowerCase(); let best=v.find(x=>(x.lang||"").toLowerCase()===lang); if(!best) best=v.find(x=>(x.lang||"").toLowerCase().startsWith(lang)); if(!best) best=v.find(x=>(x.lang||"").toLowerCase().startsWith("en")); return best||null; },
    stop(){ try{ window.speechSynthesis?.cancel(); }catch(e){} },
    pause(){ try{ window.speechSynthesis?.pause(); }catch(e){} },
    resume(){ try{ window.speechSynthesis?.resume(); }catch(e){} },
    say(text){ if(!window.speechSynthesis) return; try{ window.speechSynthesis.cancel(); }catch(e){} const u=new SpeechSynthesisUtterance(String(text||"")); const voice=this.pickVoice(); if(voice) u.voice=voice; u.lang=this.mode; u.rate=this.rate; u.pitch=1.0; window.speechSynthesis.speak(u); }
  };
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();

  const Auto={ key:"copq_v2_autoAudio", enabled:false,
    load(){ this.enabled=(localStorage.getItem(this.key)==="1"); },
    save(){ localStorage.setItem(this.key, this.enabled?"1":"0"); }
  };
  function setVoice(mode){ Speech.mode=mode; const us=$("#voiceUS"), uk=$("#voiceUK"); if(!us||!uk) return; if(mode==="en-US"){ us.classList.add("is-on"); uk.classList.remove("is-on"); us.setAttribute("aria-pressed","true"); uk.setAttribute("aria-pressed","false"); } else { uk.classList.add("is-on"); us.classList.remove("is-on"); uk.setAttribute("aria-pressed","true"); us.setAttribute("aria-pressed","false"); } }
  function syncAuto(){ const off=$("#autoOff"), on=$("#autoOn"); if(!off||!on) return; if(Auto.enabled){ on.classList.add("is-on"); off.classList.remove("is-on"); on.setAttribute("aria-pressed","true"); off.setAttribute("aria-pressed","false"); } else { off.classList.add("is-on"); on.classList.remove("is-on"); off.setAttribute("aria-pressed","true"); on.setAttribute("aria-pressed","false"); } }
  function setAuto(v){ Auto.enabled=!!v; Auto.save(); syncAuto(); }

  const Score={ now:0, max:0, awarded:new Set(),
    setMax(n){ this.max=n; updScore(); updProg(); },
    award(key, pts=1){ if(this.awarded.has(key)) return; this.awarded.add(key); this.now+=pts; updScore(); updProg(); },
    reset(){ this.now=0; this.awarded.clear(); updScore(); updProg(); }
  };
  function updScore(){ $("#scoreNow") && ($("#scoreNow").textContent=String(Score.now)); $("#scoreMax") && ($("#scoreMax").textContent=String(Score.max)); }
  function updProg(){ const bar=$("#progressBar"); if(!bar) return; const pct=Score.max ? Math.round((Score.now/Score.max)*100) : 0; bar.style.width=`${Math.max(0,Math.min(100,pct))}%`; }

  const REGIONS = [{"key": "all", "label": "🇨🇦 All Canada"}, {"key": "atlantic", "label": "🌊 Atlantic (NS/NB/PEI/NL)"}, {"key": "quebec", "label": "⚜️ Québec"}, {"key": "ontario", "label": "🏙️ Ontario"}, {"key": "prairies", "label": "🌾 Prairies (MB/SK)"}, {"key": "rockies", "label": "🏔️ Rockies (AB)"}, {"key": "bc", "label": "🌲 British Columbia"}, {"key": "north", "label": "❄️ North (YT/NT)"}];
  const SCENARIOS = [{"key": "travel_all_canada_intro", "region": "all", "tags": ["Small talk", "Trip plan", "Polite"], "title": "🧳 Small talk: ‘We’re traveling all around Canada’", "level": "A1+", "goal": "Say your plan, talk about cities + nature, and ask for a recommendation.", "context": [{"ico": "👋", "t": "You meet someone and explain your travel plan."}, {"ico": "🗺️", "t": "You say: cities + nature (Montréal, Toronto, Banff, Vancouver…)."}, {"ico": "⭐", "t": "You ask: “What do you recommend?”"}], "guide": [{"q": "Teacher asks:", "a": "Learner can answer:"}, {"q": "“Are you visiting Canada?”", "a": "“Yes. We’re traveling all around Canada.”"}, {"q": "“Where are you going?”", "a": "“We’re going to Montréal, Toronto, and Vancouver.”"}, {"q": "“Do you like cities or nature?”", "a": "“Both. We like cities and nature.”"}, {"q": "“Any questions?”", "a": "“What do you recommend?”"}], "phrases": ["We’re traveling all around Canada.", "We’re going to…", "We like cities and nature.", "We’re staying for…", "What do you recommend?", "Thank you very much."], "roleplay": [{"who": "Local", "side": "a", "say": "Hello! Are you visiting Canada?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Yes. We’re traveling all around Canada."}, {"who": "Local", "side": "a", "say": "Nice! Where are you going?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "We’re going to Montréal, Toronto, and Vancouver."}, {"who": "Local", "side": "a", "say": "Great. Do you like cities or nature?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Both. We like cities and nature."}, {"who": "Local", "side": "a", "say": "Wonderful. Enjoy your trip!"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Thank you very much."}], "drills": [{"set": "smalltalk", "say": "Where are you going?", "prompt": "Choose the best reply.", "choices": ["We’re going to Montréal and Toronto.", "We go Montreal and Toronto.", "I’m going Montréal and Toronto."], "answer": 0, "hint": "Use: We’re going to …"}, {"set": "smalltalk", "say": "Do you like cities or nature?", "prompt": "Choose the best reply.", "choices": ["Both. I like cities and nature.", "I like bothly.", "Both I like."], "answer": 0, "hint": "Use: Both."}], "buildTasks": [{"key": "b1", "title": "Say your plan", "target": "We’re traveling all around Canada.", "tokens": ["We’re", "traveling", "all", "around", "Canada."]}, {"key": "b2", "title": "Ask for a recommendation", "target": "What do you recommend?", "tokens": ["What", "do", "you", "recommend?"]}]}, {"key": "qc_hotel_smalltalk", "region": "quebec", "tags": ["Hotel", "Small talk", "Breakfast"], "title": "⚜️ Québec: hotel lobby small talk + breakfast time", "level": "A1+", "goal": "Introduce yourself, make small talk, and ask about breakfast time.", "context": [{"ico": "🏨", "t": "You meet staff in a hotel in Québec City."}, {"ico": "🪪", "t": "You present yourself (name, nationality, where you live)."}, {"ico": "🕒", "t": "You ask: “What time is breakfast?”"}], "guide": [{"q": "Teacher asks:", "a": "Learner can answer:"}, {"q": "“Welcome! What is your name?”", "a": "“My name is …”"}, {"q": "“Where are you from?”", "a": "“I’m from France.”"}, {"q": "“How long are you staying?”", "a": "“We’re staying for three nights.”"}, {"q": "“Can I help you?”", "a": "“Yes, please. What time is breakfast?”"}], "phrases": ["My name is…", "I’m from…", "We’re staying for…", "What time is breakfast?", "Could you help me, please?"], "roleplay": [{"who": "Staff", "side": "a", "say": "Hello! Welcome to Québec City. How can I help you?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Hi. Could you help me, please?"}, {"who": "Staff", "side": "a", "say": "Of course. What is your name?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "My name is Alex."}, {"who": "Staff", "side": "a", "say": "Nice to meet you. Where are you from?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "I’m from France."}, {"who": "Staff", "side": "a", "say": "Great. Anything else?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Yes, please. What time is breakfast?"}], "drills": [{"set": "hotel", "say": "What time is breakfast?", "prompt": "Choose the best reply.", "choices": ["Breakfast is from 7 to 10.", "Go straight.", "Two tickets, please."], "answer": 0, "hint": "Time answer."}, {"set": "smalltalk", "say": "Where are you from?", "prompt": "Choose the best reply.", "choices": ["I’m from France.", "I from France.", "From France I am."], "answer": 0, "hint": "Use: I’m from …"}], "buildTasks": [{"key": "b1", "title": "Ask about breakfast time", "target": "What time is breakfast, please?", "tokens": ["What", "time", "is", "breakfast,", "please?"]}, {"key": "b2", "title": "Introduce yourself", "target": "My name is Alex. I’m from France.", "tokens": ["My", "name", "is", "Alex.", "I’m", "from", "France."]}]}, {"key": "on_niagara_daytrip", "region": "ontario", "tags": ["Transit", "Plans", "Polite"], "title": "🌊 Ontario: plan a day trip (Niagara Falls)", "level": "A1+", "goal": "Ask about transport and timing for a day trip.", "context": [{"ico": "🚌", "t": "You ask about a bus or train."}, {"ico": "⏰", "t": "You ask: “When is the next bus?”"}, {"ico": "📍", "t": "You ask: “Where is the station?”"}], "guide": [{"q": "Teacher asks:", "a": "Learner can answer:"}, {"q": "“Where do you want to go?”", "a": "“To Niagara Falls, please.”"}, {"q": "“Any questions?”", "a": "“When is the next bus?”"}, {"q": "“Do you need help?”", "a": "“Yes, please. Where is the station?”"}], "phrases": ["To Niagara Falls, please.", "When is the next bus?", "Where is the station?", "Thank you."], "roleplay": [{"who": "Staff", "side": "a", "say": "Hello. Where do you want to go?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "To Niagara Falls, please."}, {"who": "Staff", "side": "a", "say": "The next bus is in 20 minutes."}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Thank you. Where is the station, please?"}, {"who": "Staff", "side": "a", "say": "It’s across from the big hotel."}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Perfect. Thank you very much."}], "drills": [{"set": "transit", "say": "When is the next bus?", "prompt": "Choose the best reply.", "choices": ["In 20 minutes.", "Downtown, please.", "Two tickets, please."], "answer": 0, "hint": "Time answer."}, {"set": "directions", "say": "Where is the station?", "prompt": "Choose the best reply.", "choices": ["It’s across from the hotel.", "It’s 20 dollars.", "It starts at 10 am."], "answer": 0, "hint": "Place answer."}], "buildTasks": [{"key": "b1", "title": "Ask about next bus", "target": "When is the next bus?", "tokens": ["When", "is", "the", "next", "bus?"]}, {"key": "b2", "title": "Ask about station", "target": "Where is the station, please?", "tokens": ["Where", "is", "the", "station,", "please?"]}]}, {"key": "at_halifax_restaurant", "region": "atlantic", "tags": ["Restaurant", "Polite", "Menu"], "title": "🌊 Atlantic: restaurant order (polite)", "level": "A1+", "goal": "Order politely and ask for the check.", "context": [{"ico": "🍽️", "t": "You order food in Halifax."}, {"ico": "🙏", "t": "You use: I’d like… / Could I have…?"}, {"ico": "🧾", "t": "You ask for the check."}], "guide": [{"q": "Teacher asks:", "a": "Learner can answer:"}, {"q": "“What would you like?”", "a": "“I’d like soup, please.”"}, {"q": "“Anything to drink?”", "a": "“Bottled water, please.”"}, {"q": "“Anything else?”", "a": "“Could I have the check, please?”"}], "phrases": ["I’d like…", "Bottled water, please.", "Could I have the check, please?", "Thank you."], "roleplay": [{"who": "Server", "side": "a", "say": "Good evening. What would you like?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "I’d like soup, please."}, {"who": "Server", "side": "a", "say": "Anything to drink?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Bottled water, please."}, {"who": "Server", "side": "a", "say": "Of course. Anything else?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Could I have the check, please?"}], "drills": [{"set": "restaurant", "say": "Anything to drink?", "prompt": "Choose the best reply.", "choices": ["Bottled water, please.", "Go straight.", "It starts at 10 am."], "answer": 0, "hint": "Drink answer."}, {"set": "restaurant", "say": "Could I have the check, please?", "prompt": "Choose the best reply.", "choices": ["Yes, of course. Here you are.", "Across from the park.", "Two tickets, please."], "answer": 0, "hint": "Check = bill."}], "buildTasks": [{"key": "b1", "title": "Ask for bottled water", "target": "Bottled water, please.", "tokens": ["Bottled", "water,", "please."]}, {"key": "b2", "title": "Ask for the check", "target": "Could I have the check, please?", "tokens": ["Could", "I", "have", "the", "check,", "please?"]}]}, {"key": "ro_tour_meeting_point", "region": "rockies", "tags": ["Tour", "Meeting point", "Safety"], "title": "🏔️ Rockies: book a tour + meeting point", "level": "A1+", "goal": "Book a tour, ask the meeting point, and confirm the time.", "context": [{"ico": "🎟️", "t": "Book a scenic tour."}, {"ico": "📍", "t": "Ask the meeting point."}, {"ico": "⏰", "t": "Confirm the time."}], "guide": [{"q": "Teacher asks:", "a": "Learner can answer:"}, {"q": "“What would you like?”", "a": "“I’d like to book a scenic tour, please.”"}, {"q": "“Any questions?”", "a": "“What is the meeting point?”"}, {"q": "“It starts at 10 am.”", "a": "“Perfect. Thank you.”"}], "phrases": ["I’d like to book…", "What is the meeting point?", "It starts at…", "Thank you."], "roleplay": [{"who": "Staff", "side": "a", "say": "Hello. How can I help you?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Hi. I’d like to book a scenic tour, please."}, {"who": "Staff", "side": "a", "say": "Certainly. It starts at 10 am."}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Great. What is the meeting point?"}, {"who": "Staff", "side": "a", "say": "The meeting point is at the visitor center."}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Perfect. Thank you very much."}], "drills": [{"set": "nature", "say": "What is the meeting point?", "prompt": "Choose the best reply.", "choices": ["At the visitor center.", "Two tickets, please.", "Go straight."], "answer": 0, "hint": "Place answer."}, {"set": "tickets", "say": "What time does it start?", "prompt": "Choose the best reply.", "choices": ["It starts at 10 am.", "It’s next to the bank.", "By bus."], "answer": 0, "hint": "Time answer."}], "buildTasks": [{"key": "b1", "title": "Book a tour", "target": "I’d like to book a scenic tour, please.", "tokens": ["I’d", "like", "to", "book", "a", "scenic", "tour,", "please."]}, {"key": "b2", "title": "Ask meeting point", "target": "What is the meeting point?", "tokens": ["What", "is", "the", "meeting", "point?"]}]}, {"key": "bc_transit_day", "region": "bc", "tags": ["Transit", "Directions", "Polite"], "title": "🌲 BC: transit day + directions to a park", "level": "A1+", "goal": "Ask about transit and directions to a park.", "context": [{"ico": "🚇", "t": "You ask for a ticket and the next bus."}, {"ico": "🧭", "t": "You ask how to get to a park."}, {"ico": "🙏", "t": "You ask politely."}], "guide": [{"q": "Teacher asks:", "a": "Learner can answer:"}, {"q": "“Where are you going?”", "a": "“To the park, please.”"}, {"q": "“Any questions?”", "a": "“When is the next bus?”"}, {"q": "“Do you understand?”", "a": "“Could you repeat, please?”"}], "phrases": ["To the park, please.", "When is the next bus?", "How do I get to…?", "Could you repeat, please?"], "roleplay": [{"who": "Staff", "side": "a", "say": "Hello. Where are you going?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "To the park, please."}, {"who": "Staff", "side": "a", "say": "The next bus is in 10 minutes."}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Thank you. How do I get to the park?"}, {"who": "Staff", "side": "a", "say": "Go straight and turn right at the corner."}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Thank you very much."}], "drills": [{"set": "transit", "say": "Where are you going?", "prompt": "Choose the best reply.", "choices": ["To the park, please.", "Two tickets, please.", "Go straight."], "answer": 0, "hint": "Destination reply."}, {"set": "directions", "say": "How do I get to the park?", "prompt": "Choose the best reply.", "choices": ["Go straight and turn right.", "It starts at 10 am.", "It is 20 dollars."], "answer": 0, "hint": "Directions."}], "buildTasks": [{"key": "b1", "title": "Ask about next bus", "target": "When is the next bus?", "tokens": ["When", "is", "the", "next", "bus?"]}, {"key": "b2", "title": "Ask directions", "target": "How do I get to the park?", "tokens": ["How", "do", "I", "get", "to", "the", "park?"]}]}, {"key": "no_weather_safety", "region": "north", "tags": ["Weather", "Safety", "Clothes"], "title": "❄️ North: weather + safety (simple)", "level": "A1+", "goal": "Ask about the weather and say what you need (jacket, bottled water).", "context": [{"ico": "🌦️", "t": "You ask: “What’s the weather like?”"}, {"ico": "🧥", "t": "You say you need a jacket."}, {"ico": "💧", "t": "You say you need bottled water."}], "guide": [{"q": "Teacher asks:", "a": "Learner can answer:"}, {"q": "“What’s the weather like?”", "a": "“It’s cold today.” / “It’s windy.”"}, {"q": "“Do you need anything?”", "a": "“Yes. I need a jacket.”"}, {"q": "“Anything else?”", "a": "“I need bottled water.”"}], "phrases": ["What’s the weather like?", "It’s cold.", "I need a jacket.", "I need bottled water.", "Thank you."], "roleplay": [{"who": "Staff", "side": "a", "say": "Hello. What’s the weather like today?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "It’s cold today."}, {"who": "Staff", "side": "a", "say": "Do you need anything?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Yes. I need a jacket."}, {"who": "Staff", "side": "a", "say": "Good idea. Anything else?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "I need bottled water."}], "drills": [{"set": "weather", "say": "What’s the weather like?", "prompt": "Choose the best reply.", "choices": ["It’s cold today.", "Two tickets, please.", "Go straight."], "answer": 0, "hint": "Weather sentence."}, {"set": "restaurant", "say": "Anything to drink?", "prompt": "Choose the best reply.", "choices": ["Bottled water, please.", "It starts at 10 am.", "Across from the park."], "answer": 0, "hint": "Drink answer."}], "buildTasks": [{"key": "b1", "title": "Ask about weather", "target": "What’s the weather like today?", "tokens": ["What’s", "the", "weather", "like", "today?"]}, {"key": "b2", "title": "Say you need water", "target": "I need bottled water.", "tokens": ["I", "need", "bottled", "water."]}]}];
  const DRILL_SETS = [{"key": "smalltalk", "label": "👋 Small talk"}, {"key": "hotel", "label": "🏨 Hotel help"}, {"key": "tickets", "label": "🎫 Tickets + times"}, {"key": "directions", "label": "🧭 Directions"}, {"key": "transit", "label": "🚇 Transit"}, {"key": "restaurant", "label": "🍽️ Restaurant"}, {"key": "nature", "label": "🏔️ Tour + safety"}, {"key": "weather", "label": "🌦️ Weather"}];

  const ALL_DRILLS = (() => {
    const out=[];
    SCENARIOS.forEach(s => (s.drills||[]).forEach(d => out.push(Object.assign({}, d, {sid:s.key}))));
    return out;
  })();

  const ALL_TASKS = (() => {
    const out=[];
    SCENARIOS.forEach(s => (s.buildTasks||[]).forEach(t => out.push(Object.assign({}, t, {sid:s.key}))));
    return out;
  })();

  let state={ region:"all", scenario:SCENARIOS[0], rpIndex:0, timerEnabled:false, role:"teacher", prepTimer:null, speakTimer:null };
  function filteredScenarios(){ return state.region==="all" ? SCENARIOS : SCENARIOS.filter(s=>s.region===state.region); }
  function currentScenario(){ return state.scenario; }

  function renderRegionSelect(){
    const sel=$("#regionSelect"); if(!sel) return;
    sel.innerHTML="";
    REGIONS.forEach(r=>{ const o=document.createElement("option"); o.value=r.key; o.textContent=r.label; sel.appendChild(o); });
    sel.value="all";
  }
  function renderScenarioSelect(){
    const sel=$("#scenarioSelect"); if(!sel) return;
    const list=filteredScenarios();
    sel.innerHTML="";
    list.forEach(s=>{ const o=document.createElement("option"); o.value=s.key; o.textContent=s.title; sel.appendChild(o); });
    sel.value=list[0]?.key || "";
  }
  function setScenarioByKey(key){
    const list=filteredScenarios();
    const sc=list.find(s=>s.key===key) || list[0] || SCENARIOS[0];
    state.scenario=sc;
    renderScenario();
  }

  function renderBadges(s){
    const host=$("#scBadges"); if(!host) return;
    host.innerHTML="";
    const regionLabel=(REGIONS.find(r=>r.key===s.region)||REGIONS[0]).label;
    [regionLabel, ...(s.tags||[])].forEach(b=>{ const span=document.createElement("span"); span.className="badge"; span.textContent=b; host.appendChild(span); });
  }

  function renderScenario(){
    const s=currentScenario();
    $("#scTitle").textContent=s.title;
    $("#scLevel").textContent=s.level || "A1+";
    renderBadges(s);

    const info=$("#scInfo"); info.innerHTML="";
    const goal=document.createElement("div");
    goal.className="line";
    goal.innerHTML=`<div class="ico">🎯</div><div><strong>Goal:</strong> ${escapeHtml(s.goal)}</div>`;
    info.appendChild(goal);
    (s.context||[]).forEach(x=>{ const row=document.createElement("div"); row.className="line"; row.innerHTML=`<div class="ico">${x.ico}</div><div>${escapeHtml(x.t)}</div>`; info.appendChild(row); });

    const guide=$("#scGuide"); guide.innerHTML="";
    (s.guide||[]).forEach((g,i)=>{ const row=document.createElement("div"); row.className="line"; row.innerHTML=`<div class="ico">${i===0 ? "🗣️" : "💬"}</div><div><strong>${escapeHtml(g.q)}</strong><br/><span class="muted">${escapeHtml(g.a)}</span></div>`; guide.appendChild(row); });

    clearRoleplay();
    $("#rpTitle").textContent="Role‑play: " + s.title;
    renderBuildTaskSelect();
  }

  function clearRoleplay(){
    const stream=$("#rpStream"); if(stream) stream.innerHTML="";
    state.rpIndex=0;
    $("#modelBox").textContent="Click “Show model reply” when needed.";
    $("#rpHintBox").classList.add("hidden");
  }

  function stopTimers(){ if(state.prepTimer){ clearInterval(state.prepTimer); state.prepTimer=null; } if(state.speakTimer){ clearInterval(state.speakTimer); state.speakTimer=null; } }
  function startPrepTimer(seconds){ stopTimers(); let t=seconds; $("#prepTime").textContent=String(t); state.prepTimer=setInterval(()=>{ t--; $("#prepTime").textContent=String(Math.max(0,t)); if(t<=0){ clearInterval(state.prepTimer); state.prepTimer=null; if(state.timerEnabled) startSpeakTimer(30); } },1000); }
  function startSpeakTimer(seconds){ if(state.speakTimer){ clearInterval(state.speakTimer); state.speakTimer=null; } let t=seconds; $("#speakTime").textContent=String(t); state.speakTimer=setInterval(()=>{ t--; $("#speakTime").textContent=String(Math.max(0,t)); if(t<=0){ clearInterval(state.speakTimer); state.speakTimer=null; } },1000); }

  function addBubble(line){
    const stream=$("#rpStream"); if(!stream) return;
    const b=document.createElement("div");
    b.className="bubble " + (line.side==="a" ? "a" : "b");
    const whoIcon=line.side==="a" ? "🟦" : "🟩";
    b.innerHTML = `<div class="who">${whoIcon} ${escapeHtml(line.who)}</div><div class="txt">${escapeHtml(line.say)}</div>
      <div class="tools"><button class="toolmini" type="button">🔊</button><button class="toolmini" type="button">↺ Repeat</button></div>`;
    const tools=$$(".toolmini", b);
    attachTap(tools[0], (e)=>{ e.stopPropagation(); if(line.say && line.say!=="(Your turn)") Speech.say(line.say); });
    attachTap(tools[1], (e)=>{ e.stopPropagation(); if(line.say && line.say!=="(Your turn)") Speech.say(line.say); });
    stream.appendChild(b);
    stream.scrollTop=stream.scrollHeight;

    const shouldAuto = Auto.enabled && ((state.role==="teacher" && line.side==="a") || (state.role==="learner" && line.side==="b"));
    if(shouldAuto && line.say && line.say!=="(Your turn)") Speech.say(line.say);
  }

  function stepRoleplay(){
    const s=currentScenario(); const lines=s.roleplay||[];
    if(state.rpIndex >= lines.length) return false;
    const line=lines[state.rpIndex];
    addBubble(line);

    if(line.side==="b"){ $("#modelBox").textContent=line.model ? line.model : "—"; if(state.timerEnabled) startPrepTimer(15); }
    else { $("#modelBox").textContent="Click “Show model reply” when needed."; }

    state.rpIndex++;
    return true;
  }
  function playRoleplay(){ clearRoleplay(); stepRoleplay(); }
  function showModelReply(){
    const s=currentScenario();
    const idx=Math.max(0, state.rpIndex-1);
    for(let i=idx;i>=0;i--){ const l=(s.roleplay||[])[i]; if(l && l.side==="b"){ $("#modelBox").textContent=l.model||"—"; if(l.model) Speech.say(l.model); Score.award("rp:model:"+s.key+":"+i, 1); return; } }
  }
  function showRoleplayHints(){
    const s=currentScenario(); const box=$("#rpHintBox"); if(!box) return;
    box.classList.remove("hidden","ok","no"); box.classList.add("ok");
    box.innerHTML="💡 Useful phrases:<br/>" + (s.phrases||[]).map(p=>"• "+escapeHtml(p)).join("<br/>");
  }
  function listenAllRoleplay(){
    const s=currentScenario();
    const txt=(s.roleplay||[]).map(l => (l.say==="(Your turn)" && l.model) ? l.model : (l.say==="(Your turn)" ? "" : l.say)).join(" ");
    Speech.say(txt);
  }

  function renderDrillSetSelect(){
    const sel=$("#drillSet"); if(!sel) return;
    sel.innerHTML="";
    DRILL_SETS.forEach(s=>{ const o=document.createElement("option"); o.value=s.key; o.textContent=s.label; sel.appendChild(o); });
    sel.value="smalltalk";
  }
  let drillState={ item:null };
  function pickDrill(){
    const set=$("#drillSet")?.value || "smalltalk";
    const pool=ALL_DRILLS.filter(d=>d.set===set);
    if(pool.length===0) return null;
    return pool[Math.floor(Math.random()*pool.length)];
  }
  function buildDrill(){
    const host=$("#drillHost"); if(!host) return;
    const it=pickDrill(); drillState.item=it;
    if(!it){ host.innerHTML="<p class='muted'>No drills in this set yet.</p>"; return; }
    host.innerHTML = `<div class="line"><div class="ico">🎯</div><div><div style="font-weight:1100;">${escapeHtml(it.prompt)}</div><div class="muted"><strong>Prompt:</strong> “${escapeHtml(it.say)}”</div></div></div>
      <div class="smallrow" style="margin-top:.55rem;"><button class="iconbtn" type="button" id="btnDrillPlay">🔊 Listen</button><button class="hintbtn" type="button" id="btnDrillHint">💡 Hint</button></div>
      <div class="choices" id="drillChoices"></div><div class="feedback hidden" id="drillFb"></div>`;
    const fb=$("#drillFb");
    attachTap($("#btnDrillPlay"), ()=>Speech.say(it.say));
    attachTap($("#btnDrillHint"), ()=>{ fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.innerHTML=`💡 <strong>Hint:</strong> ${escapeHtml(it.hint||"")}`; });
    const choices=$("#drillChoices");
    it.choices.forEach((c,i)=>{ const row=document.createElement("label"); row.className="choice"; row.innerHTML=`<input type="radio" name="drill"/><div>${escapeHtml(c)}</div>`; attachTap(row, ()=>{ const ok=(i===it.answer); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no"); fb.innerHTML= ok ? "✅ Correct!" : `❌ Not quite. Best: <strong>${escapeHtml(it.choices[it.answer])}</strong>`; if(ok) Score.award(`drill:${it.set}:${it.sid}:${it.say}`,1); }); choices.appendChild(row); });
  }

  function makeToken(text){ const t=document.createElement("div"); t.className="token"; t.textContent=text; t.draggable=true; t.addEventListener("dragstart", ()=>{ window.__dragToken=t; }); return t; }
  function buildWordOrder(host, task){
    if(!host) return { reset(){}, getBuilt(){return "";}, clear(){} };
    host.innerHTML="";
    const bank=document.createElement("div"); bank.className="bank";
    const zone=document.createElement("div"); zone.className="dropzone";
    const wrap=document.createElement("div"); wrap.className="builder"; wrap.appendChild(bank); wrap.appendChild(zone); host.appendChild(wrap);

    const idMap=new Map();
    const toks=shuffle(task.tokens).map((txt,iTok)=>{
      const t=makeToken(txt);
      t.dataset.role="bank"; t.dataset.tid=`${task.key}-t${iTok}`; idMap.set(t.dataset.tid,t);
      attachTap(t, ()=>{
        if(t.classList.contains("is-used")) return;
        const c=t.cloneNode(true);
        c.dataset.role="zone"; c.dataset.sourceTid=t.dataset.tid; c.classList.remove("is-used");
        c.draggable=true; c.addEventListener("dragstart", ()=>{ window.__dragToken=c; });
        attachTap(c, (e)=>{ e.stopPropagation(); const sid=c.dataset.sourceTid; c.remove(); const orig=idMap.get(sid); if(orig){ orig.classList.remove("is-used"); orig.draggable=true; } });
        zone.appendChild(c);
        t.classList.add("is-used"); t.draggable=false;
      });
      return t;
    });
    toks.forEach(t=>bank.appendChild(t));

    [bank, zone].forEach(cont=>{
      cont.addEventListener("dragover",(e)=>{ e.preventDefault(); cont.classList.add("is-over"); });
      cont.addEventListener("dragleave",()=>cont.classList.remove("is-over"));
      cont.addEventListener("drop",(e)=>{
        e.preventDefault(); cont.classList.remove("is-over");
        const dragged=window.__dragToken; if(!dragged) return;
        const targetTok=e.target.closest(".token");

        if(cont===bank && dragged.dataset.role==="zone"){ const sid=dragged.dataset.sourceTid; dragged.remove(); const orig=idMap.get(sid); if(orig){ orig.classList.remove("is-used"); orig.draggable=true; } return; }
        if(cont===zone && dragged.dataset.role==="bank"){ if(dragged.classList.contains("is-used")) return;
          const c=dragged.cloneNode(true);
          c.dataset.role="zone"; c.dataset.sourceTid=dragged.dataset.tid; c.classList.remove("is-used");
          c.draggable=true; c.addEventListener("dragstart", ()=>{ window.__dragToken=c; });
          attachTap(c, (e2)=>{ e2.stopPropagation(); const sid=c.dataset.sourceTid; c.remove(); const orig=idMap.get(sid); if(orig){ orig.classList.remove("is-used"); orig.draggable=true; } });
          if(targetTok && targetTok.parentElement===zone) zone.insertBefore(c, targetTok); else zone.appendChild(c);
          dragged.classList.add("is-used"); dragged.draggable=false; return;
        }
        if(cont===zone && dragged.dataset.role==="zone"){ if(targetTok && targetTok.parentElement===zone && targetTok!==dragged) zone.insertBefore(dragged, targetTok); else zone.appendChild(dragged); }
      });
    });

    function clear(){
      $$(".token", zone).forEach(z=>{ const sid=z.dataset.sourceTid; z.remove(); const orig=idMap.get(sid); if(orig){ orig.classList.remove("is-used"); orig.draggable=true; } });
      $$(".token", bank).forEach(b=>{ b.classList.remove("is-used"); b.draggable=true; });
    }
    return {
      getBuilt(){ return $$(".token", zone).map(t=>t.textContent.trim()).join(" ").replace(/\s+/g," ").trim().replace(/\s+([,?.!])/g,"$1"); },
      clear,
      reset: clear
    };
  }

  let buildAPI=null;
  function renderBuildTaskSelect(){
    const sel=$("#buildTask"); if(!sel) return;
    const s=currentScenario();
    const tasks=ALL_TASKS.filter(t=>t.sid===s.key);
    sel.innerHTML="";
    tasks.forEach((t,idx)=>{ const o=document.createElement("option"); o.value=t.key; o.textContent=`${idx+1}) ${t.title}`; sel.appendChild(o); });
    if(tasks.length===0){ const o=document.createElement("option"); o.value=""; o.textContent="No tasks"; sel.appendChild(o); }
    sel.value = tasks[0]?.key || "";
    initBuilder();
  }
  function selectedTask(){ const s=currentScenario(); const key=$("#buildTask")?.value || ""; return ALL_TASKS.find(t=>t.sid===s.key && t.key===key) || null; }
  function initBuilder(){
    const host=$("#builderHost");
    const fb=$("#buildFb"); if(fb) fb.classList.add("hidden");
    const task=selectedTask();
    if(!task){ if(host) host.innerHTML="<p class='muted'>No builder tasks in this scenario.</p>"; buildAPI=null; return; }
    buildAPI=buildWordOrder(host, task);
  }
  function checkBuilder(){
    const fb=$("#buildFb"); if(!fb) return;
    const task=selectedTask(); if(!task || !buildAPI) return;
    const built=buildAPI.getBuilt();
    const ok=normalize(built)===normalize(task.target);
    fb.classList.remove("hidden","ok","no"); fb.classList.add(ok ? "ok":"no");
    fb.innerHTML = ok ? `✅ Correct! Now say it aloud: <strong>${escapeHtml(task.target)}</strong>` :
      `❌ Not yet. You wrote: “${escapeHtml(built || "—")}”<br/>💡 Tip: tap tokens in order.`;
    if(ok) Score.award(`build:${task.sid}:${task.key}`, 2);
  }

  function resetAll(){
    Speech.stop(); Score.reset(); stopTimers();
    Auto.enabled=false; Auto.save(); syncAuto();
    setVoice("en-US");

    state.region="all";
    $("#regionSelect").value="all";
    renderScenarioSelect();
    setScenarioByKey($("#scenarioSelect").value);

    $("#drillSet").value="smalltalk";
    buildDrill();
    $("#top")?.scrollIntoView({behavior:"smooth"});
  }

  function init(){
    Auto.load(); syncAuto(); setVoice("en-US");
    if(JS_STATUS) JS_STATUS.textContent="JS: ✅ loaded";

    safeOn("#voiceUS","click", ()=>setVoice("en-US"));
    safeOn("#voiceUK","click", ()=>setVoice("en-GB"));
    safeOn("#autoOff","click", ()=>setAuto(false));
    safeOn("#autoOn","click", ()=>setAuto(true));
    safeOn("#btnPause","click", ()=>Speech.pause());
    safeOn("#btnResume","click", ()=>Speech.resume());
    safeOn("#btnStop","click", ()=>Speech.stop());
    safeOn("#btnStart","click", ()=>$("#sec1")?.scrollIntoView({behavior:"smooth"}));
    safeOn("#btnHow","click", ()=>alert("How to use (teacher + learner):\n\n1) Choose a region (or All Canada).\n2) Pick a scenario.\n3) Teacher reads blue lines; learner answers green lines.\n4) Use 'Show model reply' only when needed.\n5) Do drills + builder tasks for confidence.\n\nNo slang — polite + normal."));

    renderRegionSelect();
    state.region="all";
    renderScenarioSelect();
    setScenarioByKey($("#scenarioSelect").value);

    safeOn("#regionSelect","change", (e)=>{ state.region=e.target.value || "all"; renderScenarioSelect(); setScenarioByKey($("#scenarioSelect").value); });
    safeOn("#scenarioSelect","change", (e)=>setScenarioByKey(e.target.value));
    safeOn("#btnScenarioSpeak","click", ()=>Speech.say(currentScenario().goal));
    safeOn("#btnGuideSpeak","click", ()=>{ const s=currentScenario(); Speech.say((s.guide||[]).slice(1).map(x=>`${x.q} ${x.a}`).join(" ") || s.goal); });
    safeOn("#btnScenarioReset","click", ()=>renderScenario());

    safeOn("#roleTeacher","click", ()=>{ state.role="teacher"; $("#roleTeacher").classList.add("is-on"); $("#roleLearner").classList.remove("is-on"); });
    safeOn("#roleLearner","click", ()=>{ state.role="learner"; $("#roleLearner").classList.add("is-on"); $("#roleTeacher").classList.remove("is-on"); });
    safeOn("#timerOff","click", ()=>{ state.timerEnabled=false; $("#timerOff").classList.add("is-on"); $("#timerOn").classList.remove("is-on"); stopTimers(); });
    safeOn("#timerOn","click", ()=>{ state.timerEnabled=true; $("#timerOn").classList.add("is-on"); $("#timerOff").classList.remove("is-on"); });

    safeOn("#btnRPStart","click", ()=>playRoleplay());
    safeOn("#btnRPStep","click", ()=>stepRoleplay());
    safeOn("#btnRPClear","click", ()=>clearRoleplay());
    safeOn("#btnRPModel","click", ()=>showModelReply());
    safeOn("#btnRPHint","click", ()=>showRoleplayHints());
    safeOn("#btnRPListenAll","click", ()=>listenAllRoleplay());
    safeOn("#btnPrep","click", ()=>startPrepTimer(15));
    safeOn("#btnSpeakTimer","click", ()=>startSpeakTimer(30));

    renderDrillSetSelect();
    buildDrill();
    safeOn("#btnNewDrill","click", ()=>buildDrill());
    safeOn("#btnDrillReset","click", ()=>buildDrill());
    safeOn("#btnDrillSpeak","click", ()=>{ if(drillState.item) Speech.say(drillState.item.say); });
    safeOn("#drillSet","change", ()=>buildDrill());

    safeOn("#buildTask","change", ()=>initBuilder());
    safeOn("#btnBuildReset","click", ()=>initBuilder());
    safeOn("#btnBuildCheck","click", ()=>checkBuilder());
    safeOn("#btnBuildSpeakModel","click", ()=>{ const task=selectedTask(); if(task) Speech.say(task.target); });

    safeOn("#btnResetAll","click", ()=>{ if(!confirm("Reset ALL activities and score?")) return; resetAll(); });

    Score.setMax(60);
  }

  init();
})();
