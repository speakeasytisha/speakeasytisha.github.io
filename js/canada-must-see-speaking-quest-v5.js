/* SpeakEasyTisha — Canada Must‑See Speaking Quest v4
   Build: 20260402-113103
*/
(() => {
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const JS_STATUS=$("#jsStatus");
  
  const DEBUG=$("#debugBox");
  function logDebug(msg){
    try{
      if(!DEBUG) return;
      DEBUG.classList.remove("hidden");
      DEBUG.textContent += "\n" + msg;
    }catch(e){}
  }
  window.addEventListener("error",(e)=>{
    try{ if(JS_STATUS) JS_STATUS.textContent="JS: ❌ error"; }catch(_){}
    logDebug("[Error] " + e.message + " @ " + e.filename + ":" + e.lineno);
  });
  window.addEventListener("unhandledrejection",(e)=>{
    try{ if(JS_STATUS) JS_STATUS.textContent="JS: ❌ promise"; }catch(_){}
    logDebug("[Promise] " + String(e.reason));
  });

  function on(sel, evt, fn){
    const el=$(sel);
    if(!el){
      // don't spam too much; just note once for this selector
      logDebug("[Missing] " + sel);
      return null;
    }
    el.addEventListener(evt, fn);
    return el;
  }
const Speech={
    mode:"en-US", rate:0.97,
    stop(){ try{ speechSynthesis.cancel(); }catch(e){} },
    pause(){ try{ speechSynthesis.pause(); }catch(e){} },
    resume(){ try{ speechSynthesis.resume(); }catch(e){} },
    say(t){
      if(!window.speechSynthesis) return;
      try{ speechSynthesis.cancel(); }catch(e){}
      const u=new SpeechSynthesisUtterance(String(t||""));
      u.lang=this.mode; u.rate=this.rate;
      speechSynthesis.speak(u);
    }
  };
  const Auto={ key:"cmssq_v2_autoAudio", enabled:false,
    load(){ this.enabled=(localStorage.getItem(this.key)==="1"); },
    save(){ localStorage.setItem(this.key, this.enabled?"1":"0"); }
  };
  function setVoice(mode){
    Speech.mode=mode;
    const us=$("#voiceUS"), uk=$("#voiceUK");
    if(mode==="en-US"){ us.classList.add("is-on"); uk.classList.remove("is-on"); }
    else { uk.classList.add("is-on"); us.classList.remove("is-on"); }
  }
  function setAuto(v){
    Auto.enabled=!!v; Auto.save();
    $("#autoOn").classList.toggle("is-on", Auto.enabled);
    $("#autoOff").classList.toggle("is-on", !Auto.enabled);
  }

  const Score={now:0,max:120,aw:new Set(),
    award(k,p=1){ if(this.aw.has(k)) return; this.aw.add(k); this.now+=p; upd(); },
    reset(){ this.now=0; this.aw.clear(); upd(); }
  };
  function upd(){
    $("#scoreNow").textContent=String(Score.now);
    $("#scoreMax").textContent=String(Score.max);
    const pct=Score.max?Math.round((Score.now/Score.max)*100):0;
    $("#progressBar").style.width=Math.max(0,Math.min(100,pct))+"%";
  }
  function esc(s){
    return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }
  function norm(s){
    return String(s??"").replace(/[’']/g,"'").replace(/\s+/g," ").trim().toLowerCase();
  }
  function shuffle(a){
    a=(a||[]).slice();
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  const REGIONS=[{"key": "all", "label": "🇨🇦 All Canada"}, {"key": "atlantic", "label": "🌊 Atlantic"}, {"key": "quebec", "label": "⚜️ Québec"}, {"key": "ontario", "label": "🏙️ Ontario"}, {"key": "prairies", "label": "🌾 Prairies"}, {"key": "rockies", "label": "🏔️ Rockies"}, {"key": "bc", "label": "🌲 British Columbia"}, {"key": "north", "label": "❄️ North"}], THEMES=[{"key": "all", "label": "✨ All"}, {"key": "foodie", "label": "🍽️ Food"}, {"key": "culture", "label": "🏛️ Culture"}, {"key": "nature", "label": "🏔️ Nature"}, {"key": "romantic", "label": "💛 Romantic"}, {"key": "relaxing", "label": "🧘 Relaxing"}, {"key": "touristy", "label": "📸 Iconic / Touristy"}, {"key": "family", "label": "👨‍👩‍👧 Family‑friendly"}], BUDGETS=[{"key": "all", "label": "Any budget"}, {"key": "$", "label": "$ Budget"}, {"key": "$$", "label": "$$ Mid-range"}, {"key": "$$$", "label": "$$$ Comfortable"}, {"key": "$$$$", "label": "$$$$ Luxury"}], PLACES=[{"id": "qc_old_quebec", "region": "quebec", "theme": ["culture", "romantic", "touristy"], "title": "Old Québec (Vieux‑Québec)", "where": "Québec City · East Canada", "special": "A UNESCO‑listed old town with fortified walls, classic river views, and a “storybook” feeling—very walkable, very photogenic.", "highlights": ["Old streets + city walls", "Viewpoints over the river", "Cozy cafés + small shops", "Evening strolls (romantic)"], "bestFor": "Culture + history, couples, relaxed walking days", "timeTip": "Best for: 1–2 days. In summer: book restaurants early.", "budget": "$$ (mid‑range) — easy walking budget possible", "desc": "Old Québec feels special because history, architecture, and river views are all in one compact area. It’s perfect for calm but memorable days.", "talk": ["It is historic and beautiful.", "It is perfect for walking and photos.", "I would choose it for culture and a romantic atmosphere.", "It feels more special than a normal city center."]}, {"id": "mtl_food", "region": "quebec", "theme": ["foodie", "culture", "touristy"], "title": "Montréal: food neighborhoods + markets", "where": "Montréal · Québec", "special": "A city of flavors: markets, bakeries, creative cafés, and lively neighborhoods—great for simple ordering and preference speaking.", "highlights": ["Market browsing + local snacks", "Café culture", "Museum + food in one day", "Evening energy"], "bestFor": "Food lovers, city lovers, friendly atmosphere", "timeTip": "Best for: 2–3 days. Great in summer + early fall.", "budget": "$$ (many affordable options) + some $$$ spots", "desc": "Montréal is special because you can mix culture and food all day: market in the morning, museum in the afternoon, relaxed dinner at night.", "talk": ["It is lively and friendly.", "We can taste local food and visit markets.", "I would choose it because it has more food options than a small town.", "It is a great city for easy conversations."]}, {"id": "niagara", "region": "ontario", "theme": ["nature", "touristy", "romantic", "family"], "title": "Niagara Falls", "where": "Ontario · Near Toronto", "special": "A powerful, world‑famous natural site—loud, impressive, and easy to describe (perfect for A1+).", "highlights": ["Viewpoints + photos", "Boat experience (if available)", "Easy day trip planning", "Souvenir stops"], "bestFor": "First‑time visitors, families, iconic scenery", "timeTip": "Best for: a day trip. In summer it can be crowded—go early.", "budget": "$$ (day trip) + extra cost for activities", "desc": "Niagara Falls is special because it is immediately impressive: you see it, you hear it, and you feel the power. Great for comparatives.", "talk": ["It is very impressive and powerful.", "It can be crowded in summer.", "I would choose it because it is one of the most famous places in Canada.", "It is more impressive than a small waterfall."]}, {"id": "banff", "region": "rockies", "theme": ["nature", "relaxing", "touristy", "romantic"], "title": "Banff + Lake Louise area", "where": "Alberta · Rockies", "special": "Iconic mountain scenery: lakes, peaks, and fresh air—excellent for nature vocabulary and calm speaking practice.", "highlights": ["Lake viewpoints", "Scenic walks", "Wildlife awareness", "Quiet moments"], "bestFor": "Nature, relaxing days, photos, couples", "timeTip": "Best for: 2–4 days. In summer: reserve early and plan mornings.", "budget": "$$$ (popular) + many free outdoor activities", "desc": "This area feels special because the scenery is “wow” level. Practice adjectives: peaceful, beautiful, breathtaking, quiet.", "talk": ["The mountains are beautiful and peaceful.", "We should bring water and a jacket.", "I would choose it because it is more relaxing than a big city.", "It is one of the best places for nature."]}, {"id": "vancouver", "region": "bc", "theme": ["nature", "culture", "relaxing", "foodie"], "title": "Vancouver: city + ocean + park life", "where": "Vancouver · British Columbia", "special": "A rare mix: modern city, ocean views, and huge green spaces—easy to enjoy without long travel.", "highlights": ["Park seawall walk", "Ocean viewpoints", "Easy café culture", "Day‑trip feeling without leaving the city"], "bestFor": "City + nature in one place, relaxed planning", "timeTip": "Best for: 2–4 days. Mild weather but bring a light jacket.", "budget": "$$$ (city prices) with many free outdoor activities", "desc": "Vancouver feels special because you can have a nature day and a city day in the same place. Great for weather + directions talk.", "talk": ["It is a beautiful mix of city and nature.", "We can walk by the ocean and relax.", "I would choose it because it is calmer than some big cities.", "It is a great place for an easy schedule."]}, {"id": "halifax", "region": "atlantic", "theme": ["foodie", "relaxing", "culture", "romantic"], "title": "Halifax: ocean atmosphere + seafood night", "where": "Nova Scotia · Atlantic", "special": "A friendly coastal city with harbor views and a relaxed pace—great for restaurant speaking practice.", "highlights": ["Harbor walk", "Seafood dinner practice", "Small talk with locals", "Relaxing evenings"], "bestFor": "Relaxing trip, food, coastal mood", "timeTip": "Best for: 1–3 days. Evenings are great for a calm dinner.", "budget": "$$ (often more affordable than big cities)", "desc": "Halifax is special because it has a calm, coastal feel—perfect for practicing polite orders and simple questions.", "talk": ["It is relaxing by the water.", "We can try seafood and practice ordering politely.", "I would choose it because it is quieter than a big city.", "It feels very friendly."]}, {"id": "prairies_winnipeg", "region": "prairies", "theme": ["culture", "family", "foodie"], "title": "Winnipeg: The Forks + river atmosphere", "where": "Manitoba · Prairies", "special": "A friendly riverside meeting place with markets, food stalls, and easy walks—great for simple conversations and directions.", "highlights": ["Market snacks + local food", "Riverside walk", "Easy family day", "Indoor/outdoor depending on weather"], "bestFor": "Families, food, relaxed city break", "timeTip": "Best for: 1–2 days. Easy to combine with museums.", "budget": "$$ (good value) — many casual options", "desc": "This is special because it is simple and fun: you can eat, walk, shop a little, and relax by the river without a complicated plan.", "talk": ["It is friendly and easy to visit.", "It is great for food and a simple walk.", "I would choose it because it is relaxed and family‑friendly.", "It is calmer than a big tourist area."]}, {"id": "north_yukon", "region": "north", "theme": ["nature", "touristy", "relaxing"], "title": "Yukon: northern lights + big skies", "where": "Yukon · North", "special": "A true adventure feeling: huge landscapes and, in the right season, a chance to see the northern lights.", "highlights": ["Big sky + quiet nature", "Northern lights (seasonal)", "Warm drinks + cozy evenings", "Simple ‘wow’ vocabulary practice"], "bestFor": "Nature lovers, calm adventure, unique memories", "timeTip": "Best for: 3–5 days. Dress warmly and plan nights outside.", "budget": "$$$ (travel can cost more) — but nature experiences are the star", "desc": "It feels special because it is far from crowds: quiet, huge landscapes, and a very different atmosphere from cities.", "talk": ["It is a quiet adventure.", "It is great for big scenery and unique experiences.", "I would choose it because it feels more special than a normal trip.", "It is one of the best places for nature lovers."]}], HOTELS=[{"id": "qc_boutique", "region": "quebec", "city": "Québec City", "name": "Château‑View Boutique Inn (practice)", "price": "$$$", "atmosphere": "Boutique · romantic · quiet", "amenities": ["Very clean", "Comfortable beds", "Great location", "Wi‑Fi"], "breakfast": "Included", "restaurant": "No (nearby options)", "why": "Choose it for walkable old‑town days and a cozy evening atmosphere."}, {"id": "mtl_city", "region": "quebec", "city": "Montréal", "name": "Market‑Side City Hotel (practice)", "price": "$$", "atmosphere": "Casual · lively · city", "amenities": ["Clean rooms", "Good value", "Near metro", "Wi‑Fi"], "breakfast": "Not included", "restaurant": "Yes (casual)", "why": "Choose it for an easy base to explore markets and neighborhoods."}, {"id": "to_comfort", "region": "ontario", "city": "Toronto", "name": "Downtown Comfort Suites (practice)", "price": "$$$", "atmosphere": "Modern · comfortable", "amenities": ["Very clean", "Gym", "Quiet rooms", "Wi‑Fi"], "breakfast": "Optional (paid)", "restaurant": "Yes", "why": "Choose it for comfort and easy planning in a big city."}, {"id": "to_budget", "region": "ontario", "city": "Toronto", "name": "City Budget Stay (practice)", "price": "$", "atmosphere": "Simple · practical", "amenities": ["Basic clean room", "Good location", "Wi‑Fi"], "breakfast": "Not included", "restaurant": "No", "why": "Choose it if you want a cheaper option and you plan to eat outside."}, {"id": "hx_harbor", "region": "atlantic", "city": "Halifax", "name": "Harbor‑Walk Hotel (practice)", "price": "$$", "atmosphere": "Relaxing · coastal", "amenities": ["Clean", "Ocean vibe", "Good service", "Wi‑Fi"], "breakfast": "Included", "restaurant": "Yes (seafood)", "why": "Choose it for a calm trip and easy restaurant practice."}, {"id": "banff_lodge", "region": "rockies", "city": "Banff", "name": "Mountain Lodge & Spa (practice)", "price": "$$$$", "atmosphere": "Scenic · relaxing · upscale", "amenities": ["Very comfortable", "Spa", "Great views", "Wi‑Fi"], "breakfast": "Included", "restaurant": "Yes (nice)", "why": "Choose it for a special nature stay and comfort after outdoor days."}, {"id": "banff_motel", "region": "rockies", "city": "Banff", "name": "Trailhead Motel (practice)", "price": "$$", "atmosphere": "Simple · outdoorsy", "amenities": ["Clean", "Good base", "Parking", "Wi‑Fi"], "breakfast": "Not included", "restaurant": "No", "why": "Choose it to spend money on activities rather than the room."}, {"id": "van_seaside", "region": "bc", "city": "Vancouver", "name": "Seaside Park Hotel (practice)", "price": "$$$", "atmosphere": "Modern · scenic", "amenities": ["Clean", "Comfortable", "Great location", "Wi‑Fi"], "breakfast": "Optional (paid)", "restaurant": "Yes", "why": "Choose it for a city + nature rhythm and easy walking days."}, {"id": "north_cabin", "region": "north", "city": "Whitehorse", "name": "Northern Lights Cabin Stay (practice)", "price": "$$$", "atmosphere": "Quiet · adventure", "amenities": ["Warm", "Comfortable", "Kitchenette", "Wi‑Fi"], "breakfast": "Self‑catering", "restaurant": "No", "why": "Choose it for a calm base and a special “adventure” mood."}, {"id": "pr_airport", "region": "prairies", "city": "Winnipeg", "name": "Prairie Comfort Hotel (practice)", "price": "$$", "atmosphere": "Simple · comfortable · practical", "amenities": ["Clean", "Quiet rooms", "Parking", "Wi‑Fi"], "breakfast": "Included", "restaurant": "Yes (casual)", "why": "Choose it for good value, comfort, and an easy base for a prairie city break."}, {"id": "pr_boutique", "region": "prairies", "city": "Saskatoon", "name": "River‑View Boutique Stay (practice)", "price": "$$$", "atmosphere": "Cozy · boutique · quiet", "amenities": ["Very clean", "Comfortable beds", "Nice views", "Wi‑Fi"], "breakfast": "Optional (paid)", "restaurant": "No (nearby options)", "why": "Choose it for a calm atmosphere and a more special, cozy stay."}];
  const REST_CITIES=[{"key": "all", "label": "All"}, {"key": "Québec City", "label": "Québec City"}, {"key": "Montréal", "label": "Montréal"}, {"key": "Toronto", "label": "Toronto"}, {"key": "Halifax", "label": "Halifax"}, {"key": "Banff", "label": "Banff"}, {"key": "Vancouver", "label": "Vancouver"}, {"key": "Winnipeg", "label": "Winnipeg"}, {"key": "Saskatoon", "label": "Saskatoon"}, {"key": "Whitehorse", "label": "Whitehorse"}], RESTS=[{"id": "qc_maple", "city": "Québec City", "region": "quebec", "name": "Maple & Stone Table (practice)", "price": "$$$", "atmosphere": "Cozy · romantic · quiet", "food": "Seasonal Québec cuisine: local vegetables, maple notes, slow‑cooked meats, fresh bread.", "why": "Choose it for local flavors, calm service, and a special evening.", "forWho": "Couples, food lovers, calm diners", "try": "Maple‑glazed chicken, local cheese plate, butter‑tart style dessert"}, {"id": "mtl_market", "city": "Montréal", "region": "quebec", "name": "Smoked‑Meat & Market Bistro (practice)", "price": "$$", "atmosphere": "Lively · casual", "food": "Comfort food + market ingredients: smoked‑meat style sandwich, salads, soups, pickles.", "why": "Choose it for an easy lunch and a classic Montréal feel.", "forWho": "Friends, families, casual travelers", "try": "Smoked‑meat sandwich, poutine‑style bowl, seasonal soup"}, {"id": "to_lake", "city": "Toronto", "region": "ontario", "name": "Lakeview Modern Grill (practice)", "price": "$$$", "atmosphere": "Modern · vibrant", "food": "Contemporary Canadian: grilled fish, seasonal vegetables, clean flavors.", "why": "Choose it for fresh ingredients and a nice city dinner.", "forWho": "City visitors, professionals", "try": "Grilled salmon, seasonal vegetables, Nanaimo‑bar style dessert"}, {"id": "hx_sea", "city": "Halifax", "region": "atlantic", "name": "Harbor Seafood House (practice)", "price": "$$", "atmosphere": "Coastal · relaxed", "food": "Atlantic seafood: lobster, mussels, chowder, fresh fish.", "why": "Choose it for the ocean atmosphere and simple, fresh food.", "forWho": "Relaxed travelers, seafood fans", "try": "Seafood chowder, mussels, lobster roll‑style sandwich"}, {"id": "banff_hearty", "city": "Banff", "region": "rockies", "name": "Mountain Comfort Kitchen (practice)", "price": "$$", "atmosphere": "Warm · rustic", "food": "Hearty meals after hiking: soups, roast options, vegetarian bowls, hot drinks.", "why": "Choose it for comfort, warmth, and friendly service.", "forWho": "Hikers, families", "try": "Warm soup, roasted vegetables, hot chocolate"}, {"id": "van_pacific", "city": "Vancouver", "region": "bc", "name": "Pacific Fresh Kitchen (practice)", "price": "$$$", "atmosphere": "Bright · modern", "food": "Pacific‑style cuisine: salmon, fresh greens, light sauces, local ingredients.", "why": "Choose it for fresh flavors and a healthy feel.", "forWho": "Food lovers, health‑minded travelers", "try": "Salmon bowl, fresh salad, berry dessert"}, {"id": "pr_farm", "city": "Winnipeg", "region": "prairies", "name": "Farm‑to‑Table Prairie Kitchen (practice)", "price": "$$$", "atmosphere": "Cozy · modern", "food": "Locally sourced ingredients: seasonal vegetables, hearty dishes, homemade sauces.", "why": "Choose it for fresh prairie ingredients and a warm, calm dinner.", "forWho": "Couples, food lovers, calm diners", "try": "Seasonal bowl, roasted vegetables, homemade dessert"}, {"id": "north_warm", "city": "Whitehorse", "region": "north", "name": "Northern Warm Bistro (practice)", "price": "$$", "atmosphere": "Warm · rustic · relaxed", "food": "Comfort food for cold weather: soups, stews, hot drinks, simple local flavors.", "why": "Choose it for a cozy atmosphere after an outdoor day.", "forWho": "Travelers, families, anyone who wants warmth", "try": "Hot soup, hearty stew, hot chocolate"}], VOCAB=[{"w": "must‑see", "fr": "à ne pas manquer", "ico": "⭐", "def": "very important to visit", "ex": "Niagara Falls is a must‑see."}, {"w": "highlight", "fr": "temps fort", "ico": "✨", "def": "the best part of an experience", "ex": "The highlight is the river view."}, {"w": "viewpoint", "fr": "point de vue", "ico": "🔭", "def": "a place to see a view", "ex": "Let’s go to the viewpoint."}, {"w": "scenery", "fr": "paysage", "ico": "🏞️", "def": "natural views (mountains, lakes)", "ex": "The scenery is breathtaking."}, {"w": "historic", "fr": "historique", "ico": "🏛️", "def": "connected to history", "ex": "Old Québec is historic."}, {"w": "walkable", "fr": "où l’on peut tout faire à pied", "ico": "🚶", "def": "easy to visit on foot", "ex": "The old town is very walkable."}, {"w": "crowded", "fr": "bondé", "ico": "👥", "def": "with many people", "ex": "It can be crowded in summer."}, {"w": "quiet", "fr": "calme", "ico": "🤫", "def": "not noisy", "ex": "We’d like a quiet hotel room."}, {"w": "amenities", "fr": "équipements / services", "ico": "🧼", "def": "services in a hotel (Wi‑Fi, gym…)", "ex": "What amenities do you have?"}, {"w": "breakfast included", "fr": "petit‑déjeuner inclus", "ico": "🥐", "def": "breakfast is in the price", "ex": "Is breakfast included?"}, {"w": "comfortable", "fr": "confortable", "ico": "🛏️", "def": "easy and pleasant to use/sleep", "ex": "The bed is comfortable."}, {"w": "reservation", "fr": "réservation", "ico": "📅", "def": "booking a table", "ex": "I’d like to make a reservation."}, {"w": "signature dish", "fr": "plat signature", "ico": "🏷️", "def": "the restaurant’s special dish", "ex": "What is your signature dish?"}, {"w": "bottled water", "fr": "eau en bouteille", "ico": "💧", "def": "water in a bottle", "ex": "Bottled water, please."}, {"w": "cheaper", "fr": "moins cher", "ico": "💶", "def": "lower price", "ex": "This hotel is cheaper."}, {"w": "more expensive", "fr": "plus cher", "ico": "💳", "def": "higher price", "ex": "That restaurant is more expensive."}, {"w": "the best", "fr": "le meilleur", "ico": "🏆", "def": "number 1", "ex": "It is the best choice."}, {"w": "noisy", "fr": "bruyant", "ico": "🔊", "def": "too loud", "ex": "The room is noisy at night."}, {"w": "complaint", "fr": "réclamation", "ico": "🗣️", "def": "saying something is wrong", "ex": "I have a complaint."}, {"w": "review", "fr": "avis", "ico": "📝", "def": "a comment online about a place", "ex": "I want to write a review."}, {"w": "locally sourced", "fr": "issu de producteurs locaux", "ico": "🌿", "def": "ingredients from local farms", "ex": "The ingredients are locally sourced."}, {"w": "seasonal", "fr": "de saison", "ico": "🍂", "def": "available in a certain season", "ex": "They use seasonal vegetables."}, {"w": "cozy", "fr": "chaleureux / cosy", "ico": "🕯️", "def": "warm and comfortable", "ex": "It has a cozy atmosphere."}, {"w": "lively", "fr": "animé", "ico": "🎶", "def": "full of energy", "ex": "The restaurant is lively at night."}, {"w": "harbor", "fr": "port", "ico": "⚓", "def": "area where boats stay", "ex": "We walked by the harbor."}, {"w": "lighthouse", "fr": "phare", "ico": "🗼", "def": "tower with a light near the sea", "ex": "We visited a lighthouse."}, {"w": "hearty", "fr": "copieux", "ico": "🥘", "def": "filling and satisfying", "ex": "It’s a hearty meal after hiking."}, {"w": "fresh", "fr": "frais", "ico": "🧊", "def": "not old; recently prepared", "ex": "The fish is fresh."}, {"w": "homemade", "fr": "fait maison", "ico": "🏠", "def": "made at home / in-house", "ex": "The dessert is homemade."}, {"w": "service", "fr": "service", "ico": "🧑‍🍳", "def": "how staff help customers", "ex": "The service was friendly."}, {"w": "slow service", "fr": "service lent", "ico": "🐢", "def": "service takes too long", "ex": "We had slow service."}, {"w": "discount", "fr": "réduction", "ico": "🏷️", "def": "a lower price", "ex": "Can we have a discount?"}, {"w": "refund", "fr": "remboursement", "ico": "💸", "def": "money returned", "ex": "Can I get a refund?"}, {"w": "free cancellation", "fr": "annulation gratuite", "ico": "🆓", "def": "you can cancel without paying", "ex": "Do you offer free cancellation?"}, {"w": "apologize", "fr": "s’excuser", "ico": "🙏", "def": "to say sorry", "ex": "I apologize for the inconvenience."}, {"w": "manager", "fr": "responsable", "ico": "👔", "def": "person in charge", "ex": "Could I speak to the manager?"}, {"w": "reservation confirmed", "fr": "réservation confirmée", "ico": "✅", "def": "booking is accepted", "ex": "Is my reservation confirmed?"}, {"w": "spacious", "fr": "spacieux", "ico": "📦", "def": "with a lot of space", "ex": "The room is spacious."}, {"w": "view", "fr": "vue", "ico": "🌅", "def": "what you can see from a place", "ex": "We have a lake view."}], MCQ_POOL=[{"q": "Choose the best (polite) sentence:", "choices": ["I want a quiet table.", "I’d like a quiet table, please.", "Give me a quiet table."], "a": 1, "hint": "Use: I’d like …, please."}, {"q": "Choose the best question about breakfast:", "choices": ["Breakfast included?", "Is breakfast included?", "You have breakfast?"], "a": 1, "hint": "Use: Is … included?"}, {"q": "Choose the best complaint sentence:", "choices": ["Room is noisy.", "The room is noisy at night.", "Noisy room!!"], "a": 1, "hint": "Full sentence + time phrase."}, {"q": "Choose the best comparative:", "choices": ["This is cheap.", "This is cheaper.", "This is cheapest."], "a": 1, "hint": "Compare 2 things → cheaper."}, {"q": "Choose the best superlative:", "choices": ["It is the best option.", "It is better option.", "It is most best option."], "a": 0, "hint": "Use: the best."}, {"q": "Choose the best restaurant question:", "choices": ["What is your signature dish?", "What your signature dish?", "Signature dish is what?"], "a": 0, "hint": "Use: What is …?"}, {"q": "Choose the best check‑out question:", "choices": ["What time is check‑out?", "When check‑out?", "Time check‑out?"], "a": 0, "hint": "Use: What time is …?"}, {"q": "Choose the best plan sentence:", "choices": ["We go to Banff tomorrow.", "We are going to Banff tomorrow.", "We going to Banff tomorrow."], "a": 1, "hint": "Use: We are going to …"}, {"q": "Choose the best for “near”:", "choices": ["It is next to the hotel.", "It is next the hotel.", "It is next of the hotel."], "a": 0, "hint": "next to"}, {"q": "Choose the best past tense sentence:", "choices": ["We stay there last year.", "We stayed there last year.", "We have stay there last year."], "a": 1, "hint": "Past simple: stayed."}];
  const ROLEPLAYS=[{"key": "concierge_reco", "title": "Hotel concierge: recommendations (places + restaurants)", "phrases": ["We’re traveling all around Canada.", "Could you recommend a must‑see place?", "Could you recommend a good restaurant?", "We’d like a quiet place.", "Could we make a reservation for two at 7 pm, please?", "Do you have vegetarian options?"], "lines": [{"who": "Concierge", "side": "a", "say": "Hello! Welcome. How can I help you today?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Hello. We’re traveling all around Canada. Could you recommend a must‑see place?"}, {"who": "Concierge", "side": "a", "say": "Of course. Do you prefer cities or nature?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Both. We like cities and nature."}, {"who": "Concierge", "side": "a", "say": "Great. I recommend Old Québec for culture and Banff for nature."}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Thank you. Could you recommend a good restaurant?"}]}, {"key": "checkout_problem", "title": "Check‑out: a noisy room (complaint + solution)", "phrases": ["Excuse me, I have a complaint.", "The room was noisy at night.", "Could you help me, please?", "Could I speak to a manager, please?", "Is a discount possible?", "Thank you for your help."], "lines": [{"who": "Receptionist", "side": "a", "say": "Good morning. How was your stay?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Good morning. Excuse me, I have a complaint."}, {"who": "Receptionist", "side": "a", "say": "I’m sorry to hear that. What was the problem?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "The room was noisy at night, and we could not sleep."}]}, {"key": "restaurant_problem", "title": "Restaurant: something went wrong (undercooked food)", "phrases": ["Excuse me, there is a problem.", "I’m sorry, this is undercooked.", "Could you change it, please?", "Could I have the check, please?"], "lines": [{"who": "Server", "side": "a", "say": "Is everything OK?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Excuse me, there is a problem."}, {"who": "Server", "side": "a", "say": "I’m sorry. What is the issue?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "I’m sorry, this chicken is undercooked."}]}, {"key": "past_stay_chat", "title": "Small talk (past tense): talking about a previous stay", "phrases": ["We stayed in…", "We visited…", "We liked…", "We didn’t like…", "It was clean and comfortable."], "lines": [{"who": "Local", "side": "a", "say": "Hi! Did you visit Canada before?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "Yes. We stayed in Montréal last year."}, {"who": "Local", "side": "a", "say": "Nice! What did you do there?"}, {"who": "Learner", "side": "b", "say": "(Your turn)", "model": "We visited markets and museums. We liked the food."}]}], BUILD_TASKS=[{"key": "b1", "title": "Book a restaurant", "target": "Could we make a reservation for two at 7 pm, please?", "tokens": ["Could", "we", "make", "a", "reservation", "for", "two", "at", "7", "pm,", "please?"]}, {"key": "b2", "title": "Ask for a must‑see place", "target": "Could you recommend a must‑see place, please?", "tokens": ["Could", "you", "recommend", "a", "must‑see", "place,", "please?"]}, {"key": "b3", "title": "Compare hotels", "target": "This hotel is cheaper, but that hotel is more comfortable.", "tokens": ["This", "hotel", "is", "cheaper,", "but", "that", "hotel", "is", "more", "comfortable."]}, {"key": "b4", "title": "Past tense sentence", "target": "We stayed there last summer and we loved it.", "tokens": ["We", "stayed", "there", "last", "summer", "and", "we", "loved", "it."]}], PAST={"rules": ["Affirmative: Subject + past verb. Example: We stayed in Montréal.", "Negative: Subject + did not (didn’t) + base verb. Example: We didn’t like the room.", "Question: Did + subject + base verb? Example: Did you visit Niagara Falls?"], "verbs": [{"base": "stay", "past": "stayed"}, {"base": "visit", "past": "visited"}, {"base": "like", "past": "liked"}, {"base": "love", "past": "loved"}, {"base": "go", "past": "went"}, {"base": "have", "past": "had"}, {"base": "be", "past": "was / were"}], "ex": [{"text": "We ____ (stay) in Toronto last year.", "options": ["stay", "stayed", "staying"], "a": 1, "hint": "Past simple of stay → stayed."}, {"text": "We didn’t ____ (like) the noisy room.", "options": ["liked", "like", "liking"], "a": 1, "hint": "After didn’t → base verb."}, {"text": "____ you visit Banff?", "options": ["Did", "Do", "Does"], "a": 0, "hint": "Past question → Did."}]}, LISTEN={"script": "Hello! If you like food, I recommend markets and locally sourced restaurants. If you prefer nature, Banff is beautiful, but it can be crowded in summer. Vancouver is great because you can enjoy the city and nature in the same day. For hotels, ask about cleanliness, comfort, and whether breakfast is included.", "q": [{"q": "What is recommended for popular restaurants?", "choices": ["Make a reservation", "Go without a plan", "Eat only at the hotel"], "a": 0, "hint": "Booking."}, {"q": "Why can Banff be difficult in summer?", "choices": ["It can be crowded", "It is closed", "It is in Toronto"], "a": 0, "hint": "crowded."}, {"q": "What hotel detail is mentioned?", "choices": ["Breakfast included", "Room color", "Car parking only"], "a": 0, "hint": "breakfast."}]}, READING={"text": "This summer, we plan to travel all around Canada. First, we will visit Montréal and Québec City to enjoy culture and great food. Then, we will go to Toronto for a big city experience and a day trip to Niagara Falls. After that, we want a relaxing nature break in the Rockies. We will compare hotels: one may be cheaper, but another may be more comfortable and include breakfast.", "q": [{"q": "Which two cities are in Québec?", "choices": ["Montréal and Québec City", "Toronto and Vancouver", "Halifax and Banff"], "a": 0, "hint": "First sentence."}, {"q": "What day trip is planned from Toronto?", "choices": ["Niagara Falls", "Northern lights", "Banff"], "a": 0, "hint": "Toronto part."}, {"q": "What do they compare at the end?", "choices": ["Hotels", "Airplanes", "Sports teams"], "a": 0, "hint": "End of text."}]};

  const regionLabel=(k)=>(REGIONS.find(r=>r.key===k)||REGIONS[0]).label;
  const themeLabel =(k)=>(THEMES.find(t=>t.key===k)||THEMES[0]).label;

  // 1) Places
  const placeState={region:"all", theme:"all", place:null};
  function renderFilters(){
    const r=$("#regionSelect"), t=$("#themeSelect");
    r.innerHTML=""; t.innerHTML="";
    REGIONS.forEach(x=>{ const o=document.createElement("option"); o.value=x.key; o.textContent=x.label; r.appendChild(o); });
    THEMES.forEach(x=>{ const o=document.createElement("option"); o.value=x.key; o.textContent=x.label; t.appendChild(o); });
    r.value=placeState.region; t.value=placeState.theme;
  }
  function filteredPlaces(){
    return PLACES.filter(p => (placeState.region==="all"||p.region===placeState.region) &&
      (placeState.theme==="all" || (p.theme||[]).includes(placeState.theme)));
  }
  function selectPlace(id){
    const p=PLACES.find(x=>x.id===id) || null;
    placeState.place=p;
    $("#placeTitle").textContent=p?p.title:"Choose a place";
    $("#placeWhere").textContent=p?p.where:"";
    $("#placeSpecial").textContent=p?p.special:"";
    $("#placeHighlights").textContent=p?(p.highlights||[]).join(" · "):"";
    $("#placeBestFor").textContent=p?p.bestFor:"";
    $("#placeTimeTip").textContent=p?p.timeTip:"";
    $("#placeBudget").textContent=p?p.budget:"";
    $("#placeDesc").textContent=p?p.desc:"";
    $("#placeBadges").innerHTML = p ? (`<span class="badge">${esc(regionLabel(p.region))}</span>` + (p.theme||[]).map(k=>`<span class="badge">${esc(themeLabel(k))}</span>`).join("")) : "";
    $("#placeTalk").innerHTML = p ? (p.talk||[]).map((s,i)=>`<div>• <strong>Sentence ${i+1}:</strong> ${esc(s)}</div>`).join("") : "";
    $("#placeFb").classList.add("hidden");
  }
  function renderPlaceGrid(){
    const grid=$("#placesGrid"); grid.innerHTML="";
    const list=filteredPlaces();
    list.forEach(p=>{
      const card=document.createElement("div");
      card.className="card";
      const themeBadges=(p.theme||[]).slice(0,3).map(k=>`<span class="badge">${esc(themeLabel(k))}</span>`).join("");
      card.innerHTML = `
        <h3 style="margin:.05rem 0 .35rem">${esc(p.title)}</h3>
        <div class="badgeRow"><span class="badge">${esc(regionLabel(p.region))}</span>${themeBadges}</div>
        <div class="muted">${esc(p.where)}</div>
        <p style="margin:.45rem 0 0">${esc(p.special)}</p>
        <div class="smallrow">
          <button class="toolmini" type="button" data-act="sel">🔎 Select</button>
          <button class="toolmini" type="button" data-act="tts">🔊</button>
        </div>`;
      card.querySelector('[data-act="sel"]').addEventListener("click",()=>selectPlace(p.id));
      card.querySelector('[data-act="tts"]').addEventListener("click",()=>Speech.say((p.talk||[]).join(" ")));
      grid.appendChild(card);
    });
    if(!placeState.place && list.length) selectPlace(list[0].id);
  }

  function placeHelp(){
    const p=placeState.place; if(!p) return;
    alert("Speak pattern:\n1) It is …\n2) It is great for …\n3) I would choose it because …\n4) It is more … than …\n\n"+p.talk.join("\n"));
  }

  // 2) Hotels
  const hotelState={region:"all", budget:"all", breakfast:"all"};
  function renderHotelFilters(){
    const r=$("#hotelRegion"), b=$("#hotelBudget");
    r.innerHTML=""; b.innerHTML="";
    REGIONS.forEach(x=>{ const o=document.createElement("option"); o.value=x.key; o.textContent=x.label; r.appendChild(o); });
    BUDGETS.forEach(x=>{ const o=document.createElement("option"); o.value=x.key; o.textContent=x.label; b.appendChild(o); });
    r.value=hotelState.region; b.value=hotelState.budget;
  }
  function filteredHotels(){
    return HOTELS.filter(h => (hotelState.region==="all"||h.region===hotelState.region) &&
      (hotelState.budget==="all"||h.price===hotelState.budget) &&
      (hotelState.breakfast==="all"||h.breakfast===hotelState.breakfast));
  }
  function renderHotelGuide(h){
    $("#hotelGuide").innerHTML = `
      <div><strong>Step 1:</strong> We’d like a clean and comfortable hotel. We’d like a quiet room.</div>
      <div style="margin-top:.35rem"><strong>Step 2:</strong> Is breakfast included? What amenities do you have?</div>
      <div style="margin-top:.35rem"><strong>Step 3:</strong> This option is <strong>${esc(h.price)}</strong>. Another hotel might be cheaper, but less comfortable.</div>
      <div class="smallrow" style="margin-top:.55rem">
        <button class="toolmini" id="btnHotelDone" type="button">✅ Done (+2)</button>
        <button class="toolmini" id="btnHotelModel" type="button">🔊 Listen model</button>
      </div>`;
    $("#btnHotelDone").addEventListener("click",()=>{ Score.award("hotel:"+h.id,2); const fb=$("#hotelFb"); fb.classList.remove("hidden"); fb.classList.add("ok"); fb.textContent="✅ Great!";});
    $("#btnHotelModel").addEventListener("click",()=>Speech.say(`We would like a clean and comfortable hotel in ${h.city}. Is breakfast included? What amenities do you have?`));
  }
  function renderHotelGrid(){
    const grid=$("#hotelGrid"); grid.innerHTML="";
    const list=filteredHotels();
    list.forEach(h=>{
      const card=document.createElement("div");
      card.className="card";
      card.innerHTML = `
        <h3 style="margin:.05rem 0 .35rem">🏨 ${esc(h.name)}</h3>
        <div class="badgeRow">
          <span class="badge">${esc(regionLabel(h.region))}</span>
          <span class="badge">${esc(h.city)}</span>
          <span class="badge">${esc(h.price)}</span>
          <span class="badge">${esc(h.breakfast)}</span>
        </div>
        <div class="muted"><strong>Atmosphere:</strong> ${esc(h.atmosphere)}</div>
        <p class="muted" style="margin:.35rem 0 0"><strong>Amenities:</strong> ${esc((h.amenities||[]).join(" · "))}</p>
        <p style="margin:.35rem 0 0">${esc(h.why)}</p>
        <div class="smallrow">
          <button class="toolmini" type="button" data-act="prac">🗣️ Practice</button>
          <button class="toolmini" type="button" data-act="tts">🔊</button>
        </div>`;
      card.querySelector('[data-act="prac"]').addEventListener("click",()=>renderHotelGuide(h));
      card.querySelector('[data-act="tts"]').addEventListener("click",()=>Speech.say(`This is ${h.name}. Breakfast is ${h.breakfast}.`));
      grid.appendChild(card);
    });
    if(list.length) renderHotelGuide(list[0]);
    else $("#hotelGuide").innerHTML="<div class='muted'>Try another filter.</div>";
  }

  // 3) Restaurants
  const restState={city:"all"};
  function renderRestCity(){
    const sel=$("#restCity"); sel.innerHTML="";
    REST_CITIES.forEach(x=>{ const o=document.createElement("option"); o.value=x.key; o.textContent=x.label; sel.appendChild(o); });
    sel.value=restState.city;
  }
  function filteredRests(){ return RESTS.filter(r => restState.city==="all"||r.city===restState.city); }
  function renderRestGuide(r){
    $("#restGuide").innerHTML = `
      <div><strong>Step 1:</strong> We’d like a quiet restaurant. We’d like locally sourced food (local food).</div>
      <div style="margin-top:.35rem"><strong>Step 2:</strong> What is your signature dish? Do you have vegetarian options?</div>
      <div style="margin-top:.35rem"><strong>Step 3:</strong> ${esc(r.why)}</div>
      <div style="margin-top:.35rem"><strong>Try:</strong> <span class="muted">${esc(r.try)}</span></div>
      <div class="smallrow" style="margin-top:.55rem">
        <button class="toolmini" id="btnRestDone" type="button">✅ Done (+2)</button>
        <button class="toolmini" id="btnRestModel" type="button">🔊 Listen model</button>
      </div>`;
    $("#btnRestDone").addEventListener("click",()=>{ Score.award("rest:"+r.id,2); const fb=$("#restFb"); fb.classList.remove("hidden"); fb.classList.add("ok"); fb.textContent="✅ Great!";});
    $("#btnRestModel").addEventListener("click",()=>Speech.say(`We would like a quiet restaurant in ${r.city}. What is your signature dish?`));
  }
  function renderRestGrid(){
    const grid=$("#restGrid"); grid.innerHTML="";
    const list=filteredRests();
    list.forEach(r=>{
      const card=document.createElement("div"); card.className="card";
      card.innerHTML = `
        <h3 style="margin:.05rem 0 .35rem">🍽️ ${esc(r.name)}</h3>
        <div class="badgeRow"><span class="badge">${esc(r.city)}</span><span class="badge">${esc(r.price)}</span><span class="badge">${esc(r.atmosphere)}</span></div>
        <div class="muted"><strong>Food:</strong> ${esc(r.food)}</div>
        <p style="margin:.35rem 0 0">${esc(r.why)}</p>
        <p class="muted" style="margin:.35rem 0 0"><strong>Try:</strong> ${esc(r.try)}</p>
        <div class="smallrow"><button class="toolmini" type="button" data-act="prac">🗣️ Practice</button><button class="toolmini" type="button" data-act="tts">🔊</button></div>`;
      card.querySelector('[data-act="prac"]').addEventListener("click",()=>renderRestGuide(r));
      card.querySelector('[data-act="tts"]').addEventListener("click",()=>Speech.say(`I recommend ${r.name} in ${r.city}.`));
      grid.appendChild(card);
    });
    if(list.length) renderRestGuide(list[0]);
    else $("#restGuide").innerHTML="<div class='muted'>Choose another city.</div>";
  }

  // 4) Vocab
  const vocabState={q:"", cat:"all"};
  const VOCAB_CATS=[
    {key:"all", label:"All"},
    {key:"places", label:"Places & Planning"},
    {key:"hotels", label:"Hotels"},
    {key:"food", label:"Restaurants & Food"},
    {key:"compare", label:"Comparatives"},
    {key:"problems", label:"Problems & Reviews"}
  ];
  function vocabCatOf(v){
    const w=norm(v.w);
    const eq=(s)=>norm(s)===w;
    const places=["must‑see","highlight","viewpoint","scenery","historic","walkable","crowded","recommend","worth it","quiet"];
    const hotels=["amenities","breakfast included","free cancellation","comfortable","clean / cleanliness","check‑in","check‑out"];
    const food=["reservation","locally sourced","seasonal","signature dish","vegetarian options","bottled water","the check / the bill"];
    const compare=["cheaper","more expensive","better","the best"];
    const problems=["a problem","noisy","undercooked","complaint","refund","review"];
    if(places.some(eq)) return "places";
    if(hotels.some(eq)) return "hotels";
    if(food.some(eq)) return "food";
    if(compare.some(eq)) return "compare";
    if(problems.some(eq)) return "problems";
    return "places";
  }
  function renderVocabCats(){
    const sel=$("#vCat");
    if(!sel) return;
    sel.innerHTML="";
    VOCAB_CATS.forEach(c=>{
      const o=document.createElement("option");
      o.value=c.key;
      o.textContent=c.label;
      sel.appendChild(o);
    });
    sel.value=vocabState.cat || "all";
  }

  function renderVocab(){
    const grid=$("#vocabGrid"); grid.innerHTML="";
    const q=norm(vocabState.q);
    const cat=vocabState.cat || "all";
    const list=VOCAB.filter(v=>{
      const vcat=vocabCatOf(v);
      const catOk=(cat==="all" || vcat===cat);
      const qOk=(!q) || norm(v.w).includes(q) || norm(v.fr).includes(q) || norm(v.def).includes(q) || norm(v.ex).includes(q);
      return catOk && qOk;
    });
    list.forEach(v=>{
      const card=document.createElement("div"); card.className="card";
      card.innerHTML = `
        <h3 style="margin:.05rem 0 .35rem">${esc(v.ico)} ${esc(v.w)}</h3>
        <div class="muted"><strong>FR:</strong> ${esc(v.fr)}</div>
        <div class="badgeRow" style="margin-top:.35rem"><span class="badge">📌 ${esc((VOCAB_CATS.find(c=>c.key===vocabCatOf(v))||VOCAB_CATS[0]).label)}</span></div>
        <div class="smallrow" style="margin-top:.45rem">
          <button class="toolmini" data-act="rev">Reveal</button>
          <button class="toolmini" data-act="tts">🔊</button>
          <button class="toolmini" data-act="pt">✅ +1</button>
        </div>
        <div class="kcard hidden" data-box="1">
          <div><strong>Definition:</strong> ${esc(v.def)}</div>
          <div style="margin-top:.25rem"><strong>Example:</strong> ${esc(v.ex)}</div>
        </div>`;
      const box=card.querySelector('[data-box="1"]');
      card.addEventListener("click",()=>box.classList.toggle("hidden"));
      card.querySelector('[data-act="rev"]').addEventListener("click",(e)=>{ e.stopPropagation(); box.classList.toggle("hidden"); });
      card.querySelector('[data-act="tts"]').addEventListener("click",(e)=>{ e.stopPropagation(); Speech.say(v.ex); });
      card.querySelector('[data-act="pt"]').addEventListener("click",(e)=>{ e.stopPropagation(); Score.award("vocab:"+v.w,1); });
      grid.appendChild(card);
    });
    if(!list.length) grid.innerHTML = `<div class="card"><h3>No results</h3><p class="muted">Try another keyword.</p></div>`;
  }

  // Quick check (10)
  const qc={items:[], idx:0, hint:""};
  function startQC(){
    qc.items=shuffle(MCQ_POOL).slice(0,10);
    qc.idx=0;
    $("#qcFb").classList.add("hidden");
    renderQC();
  }
  function renderQC(){
    const host=$("#qcHost"); host.innerHTML="";
    if(qc.idx>=qc.items.length){
      host.innerHTML=`<div class="kcard"><strong>✅ Finished!</strong> Start a new set if you want.</div>`;
      const fb=$("#qcFb"); fb.classList.remove("hidden"); fb.classList.add("ok"); fb.textContent="✅ Great work!";
      return;
    }
    const it=qc.items[qc.idx]; qc.hint=it.hint||"";
    host.innerHTML = `<div class="kcard"><strong>Q${qc.idx+1}/10:</strong> ${esc(it.q)}</div><div id="qcChoices"></div>`;
    const choices=$("#qcChoices");
    it.choices.forEach((c,i)=>{
      const row=document.createElement("label");
      row.className="choice";
      row.innerHTML = `<input type="radio" name="qc"/><div>${esc(c)}</div>`;
      row.addEventListener("click",()=>{
        const ok=i===it.a;
        const fb=$("#qcFb"); fb.classList.remove("hidden"); fb.classList.toggle("ok", ok); fb.classList.toggle("no", !ok);
        fb.innerHTML = ok ? "✅ Correct!" : `❌ Best: <strong>${esc(it.choices[it.a])}</strong>`;
        if(ok) Score.award("qc:"+qc.idx,1);
        setTimeout(()=>{ qc.idx++; renderQC(); }, 350);
      });
      choices.appendChild(row);
    });
  }

  // Roleplays
  const rpState={key:(ROLEPLAYS[0]?.key||""), role:"teacher", timer:false, idx:0, prepTimer:null, speakTimer:null};
  const currentRP=()=>ROLEPLAYS.find(r=>r.key===rpState.key)||ROLEPLAYS[0];
  function renderRpSelect(){
    const sel=$("#rpSelect"); sel.innerHTML="";
    ROLEPLAYS.forEach(r=>{ const o=document.createElement("option"); o.value=r.key; o.textContent=r.title; sel.appendChild(o); });
    sel.value=rpState.key;
    $("#rpTitle").textContent="Role‑play: " + (currentRP()?.title||"");
    clearRP();
  }
  function clearRP(){
    $("#rpStream").innerHTML="";
    rpState.idx=0;
    $("#modelBox").textContent="Click “Show model reply” when needed.";
    $("#rpHintBox").classList.add("hidden");
  }
  function getLineSpeakText(line){
  const say=String((line && line.say) || "").trim();
  const model=String((line && line.model) || "").trim();
  // If it's a learner turn placeholder, speak the model for pronunciation practice.
  if(!say || say==="(Your turn)") return model || "";
  return say;
}

function addBubble(line){
  const b=document.createElement("div");
  b.className="bubble " + (line.side==="a"?"a":"b");
  const whoIcon=line.side==="a"?"🟦":"🟩";
  const speakText=getLineSpeakText(line);

  b.innerHTML = `
    <div class="who">${whoIcon} ${esc(line.who)}</div>
    <div class="txt">${esc(line.say)}</div>
    <div class="tools">
      <button class="toolmini" type="button" data-act="listen">🔊 Listen</button>
      ${line.side==="b" && line.model ? `<button class="toolmini" type="button" data-act="listenModel">✅ Model</button>` : ``}
    </div>
  `;

  const stream=$("#rpStream");
  stream.appendChild(b);
  stream.scrollTop=stream.scrollHeight;

  // Listen buttons
  const btnListen=b.querySelector('[data-act="listen"]');
  if(btnListen){
    btnListen.addEventListener("click", (e)=>{
      e.preventDefault(); e.stopPropagation();
      if(speakText) Speech.say(speakText);
    });
  }
  const btnModel=b.querySelector('[data-act="listenModel"]');
  if(btnModel){
    btnModel.addEventListener("click", (e)=>{
      e.preventDefault(); e.stopPropagation();
      if(line.model) Speech.say(line.model);
    });
  }

  // Auto audio (when enabled)
  const shouldAuto = Auto.enabled && ((rpState.role==="teacher" && line.side==="a") || (rpState.role==="learner" && line.side==="b"));
  if(shouldAuto){
    if(speakText) Speech.say(speakText);
  }

  if(line.side==="b") $("#modelBox").textContent=line.model||"—";
}
  function stepRP(){
    const r=currentRP(); const lines=r.lines||[];
    if(rpState.idx>=lines.length) return false;
    addBubble(lines[rpState.idx]);
    rpState.idx++;
    return true;
  }
  function playRP(){ clearRP(); stepRP(); }
  function showModel(){
    const r=currentRP(); const lines=r.lines||[];
    for(let i=rpState.idx-1;i>=0;i--){
      if(lines[i] && lines[i].side==="b"){
        $("#modelBox").textContent=lines[i].model||"—";
        if(lines[i].model) Speech.say(lines[i].model);
        Score.award("rp:model:"+r.key+":"+i,1);
        return;
      }
    }
  }
  function showHints(){
    const r=currentRP();
    const box=$("#rpHintBox");
    box.classList.remove("hidden"); box.classList.add("ok");
    box.innerHTML="💡 Useful phrases:<br/>" + (r.phrases||[]).map(p=>"• "+esc(p)).join("<br/>");
  }

  // Past simple rules + quiz
  function renderPastRules(){
    $("#pastRules").innerHTML = `
      <div style="font-weight:950;margin-bottom:.35rem">How to form the past simple</div>
      <ul style="margin:.2rem 0;padding-left:1.1rem;line-height:1.65">
        ${(PAST.rules||[]).map(r=>`<li>${esc(r)}</li>`).join("")}
      </ul>
      <div class="muted"><strong>Useful verbs:</strong> ${(PAST.verbs||[]).map(v=>`${esc(v.base)} → ${esc(v.past)}`).join(" · ")}</div>`;
  }
  function renderPastQuiz(){
    const host=$("#pastHost"); host.innerHTML="";
    (PAST.ex||[]).forEach((it, idx)=>{
      const row=document.createElement("div");
      row.className="choice";
      row.innerHTML = `<div style="font-weight:950;">${idx+1}) ${esc(it.text)}</div>
        <div style="margin-top:.35rem;">
          <select class="select" data-idx="${idx}">${shuffle(it.options.map((o,i)=>({o,i}))).map(x=>`<option value="${x.i}">${esc(x.o)}</option>`).join("")}</select>
          <button class="toolmini" data-h="${idx}" type="button">💡</button>
        </div>`;
      host.appendChild(row);
    });
    $$("#pastHost button[data-h]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const idx=parseInt(btn.dataset.h,10);
        const fb=$("#pastFb"); fb.classList.remove("hidden"); fb.classList.add("no");
        fb.textContent="💡 " + (PAST.ex[idx]?.hint || "");
      });
    });
    const row=document.createElement("div");
    row.className="smallrow";
    row.innerHTML = `<button class="btn" id="btnPastCheck" type="button">✅ Check</button>
                     <button class="btn btn--ghost" id="btnPastReset" type="button">↺ Reset</button>`;
    host.appendChild(row);
    $("#btnPastCheck").addEventListener("click",()=>{
      let ok=0;
      $$("#pastHost select").forEach(sel=>{
        const idx=parseInt(sel.dataset.idx,10);
        const it=PAST.ex[idx];
        if(parseInt(sel.value,10)===it.a) ok++;
      });
      const fb=$("#pastFb"); fb.classList.remove("hidden"); fb.classList.toggle("ok", ok===PAST.ex.length); fb.classList.toggle("no", ok!==PAST.ex.length);
      fb.textContent = ok===PAST.ex.length ? "✅ Perfect!" : `❌ ${ok}/${PAST.ex.length} correct.`;
      if(ok===PAST.ex.length) Score.award("past:quiz",4);
    });
    $("#btnPastReset").addEventListener("click",()=>{ renderPastQuiz(); $("#pastFb").classList.add("hidden"); });
  }

  // Builder
  let buildAPI=null;
  function makeToken(text){
    const t=document.createElement("div");
    t.className="token";
    t.textContent=text;
    t.draggable=true;
    t.addEventListener("dragstart",()=>{ window.__dragToken=t; });
    return t;
  }
  function buildWordOrder(host, task){
    host.innerHTML="";
    const bank=document.createElement("div"); bank.className="bank";
    const zone=document.createElement("div"); zone.className="dropzone";
    const wrap=document.createElement("div"); wrap.className="builder";
    wrap.appendChild(bank); wrap.appendChild(zone);
    host.appendChild(wrap);

    const idMap=new Map();
    shuffle(task.tokens).forEach((txt,iTok)=>{
      const t=makeToken(txt);
      t.dataset.role="bank";
      t.dataset.tid=`${task.key}-t${iTok}`;
      idMap.set(t.dataset.tid,t);
      t.addEventListener("click",()=>{
        if(t.classList.contains("is-used")) return;
        const c=t.cloneNode(true);
        c.dataset.role="zone";
        c.dataset.sourceTid=t.dataset.tid;
        c.draggable=true;
        c.addEventListener("dragstart",()=>{ window.__dragToken=c; });
        c.addEventListener("click",(e)=>{
          e.stopPropagation();
          const sid=c.dataset.sourceTid;
          c.remove();
          const orig=idMap.get(sid);
          if(orig){ orig.classList.remove("is-used"); orig.draggable=true; }
        });
        zone.appendChild(c);
        t.classList.add("is-used");
        t.draggable=false;
      });
      bank.appendChild(t);
    });

    [bank, zone].forEach(cont=>{
      cont.addEventListener("dragover",(e)=>{ e.preventDefault(); cont.classList.add("is-over"); });
      cont.addEventListener("dragleave",()=>cont.classList.remove("is-over"));
      cont.addEventListener("drop",(e)=>{
        e.preventDefault(); cont.classList.remove("is-over");
        const dragged=window.__dragToken; if(!dragged) return;
        const targetTok=e.target.closest(".token");

        if(cont===bank && dragged.dataset.role==="zone"){
          const sid=dragged.dataset.sourceTid;
          dragged.remove();
          const orig=idMap.get(sid);
          if(orig){ orig.classList.remove("is-used"); orig.draggable=true; }
          return;
        }
        if(cont===zone && dragged.dataset.role==="bank"){
          if(dragged.classList.contains("is-used")) return;
          const c=dragged.cloneNode(true);
          c.dataset.role="zone";
          c.dataset.sourceTid=dragged.dataset.tid;
          c.draggable=true;
          c.addEventListener("dragstart",()=>{ window.__dragToken=c; });
          c.addEventListener("click",(e2)=>{
            e2.stopPropagation();
            const sid=c.dataset.sourceTid;
            c.remove();
            const orig=idMap.get(sid);
            if(orig){ orig.classList.remove("is-used"); orig.draggable=true; }
          });
          if(targetTok && targetTok.parentElement===zone) zone.insertBefore(c, targetTok);
          else zone.appendChild(c);
          dragged.classList.add("is-used");
          dragged.draggable=false;
          return;
        }
        if(cont===zone && dragged.dataset.role==="zone"){
          if(targetTok && targetTok.parentElement===zone && targetTok!==dragged) zone.insertBefore(dragged, targetTok);
          else zone.appendChild(dragged);
        }
      });
    });

    function getBuilt(){
      return $$(".token", zone).map(t=>t.textContent.trim()).join(" ")
        .replace(/\s+/g," ").trim().replace(/\s+([,?.!])/g,"$1");
    }
    function clear(){
      $$(".token", zone).forEach(z=>{
        const sid=z.dataset.sourceTid; z.remove();
        const orig=idMap.get(sid);
        if(orig){ orig.classList.remove("is-used"); orig.draggable=true; }
      });
      $$(".token", bank).forEach(b=>{ b.classList.remove("is-used"); b.draggable=true; });
    }
    return {getBuilt, clear};
  }

  function renderBuildSelect(){
    const sel=$("#buildSelect"); sel.innerHTML="";
    BUILD_TASKS.forEach((t,i)=>{ const o=document.createElement("option"); o.value=t.key; o.textContent=`${i+1}) ${t.title}`; sel.appendChild(o); });
    sel.value=BUILD_TASKS[0]?.key||"";
    initBuilder();
  }
  function currentBuildTask(){
    const key=$("#buildSelect").value;
    return BUILD_TASKS.find(t=>t.key===key)||BUILD_TASKS[0];
  }
  function initBuilder(){
    buildAPI=buildWordOrder($("#builderHost"), currentBuildTask());
    $("#buildFb").classList.add("hidden");
  }
  function checkBuilder(){
    const task=currentBuildTask();
    const built=buildAPI.getBuilt();
    const ok=norm(built)===norm(task.target);
    const fb=$("#buildFb");
    fb.classList.remove("hidden"); fb.classList.toggle("ok", ok); fb.classList.toggle("no", !ok);
    fb.innerHTML = ok ? `✅ Correct! <strong>${esc(task.target)}</strong>` : `❌ Not yet. You wrote: “${esc(built||"—")}”`;
    if(ok) Score.award("build:"+task.key,2);
  }

  // Listening & Reading
  function renderListen(){
    const host=$("#listenQ"); host.innerHTML="";
    (LISTEN.q||[]).forEach((it, idx)=>{
      const block=document.createElement("div");
      block.className="choice";
      block.innerHTML = `<div style="font-weight:950;">${idx+1}) ${esc(it.q)}</div>`;
      const ch=document.createElement("div");
      it.choices.forEach((c,i)=>{
        const row=document.createElement("label");
        row.className="choice";
        row.innerHTML = `<input type="radio" name="l_${idx}"/><div>${esc(c)}</div>`;
        row.addEventListener("click",()=>{
          const ok=i===it.a;
          const fb=$("#listenFb"); fb.classList.remove("hidden"); fb.classList.toggle("ok",ok); fb.classList.toggle("no",!ok);
          fb.textContent = ok ? "✅ Correct!" : `❌ Hint: ${it.hint}`;
          if(ok) Score.award("listen:"+idx,1);
        });
        ch.appendChild(row);
      });
      host.appendChild(block); host.appendChild(ch);
    });
  }
  function renderReading(){
    $("#readingText").textContent = READING.text||"";
    const host=$("#readingQ"); host.innerHTML="";
    (READING.q||[]).forEach((it, idx)=>{
      const block=document.createElement("div");
      block.className="choice";
      block.innerHTML = `<div style="font-weight:950;">${idx+1}) ${esc(it.q)}</div>`;
      const ch=document.createElement("div");
      it.choices.forEach((c,i)=>{
        const row=document.createElement("label");
        row.className="choice";
        row.innerHTML = `<input type="radio" name="r_${idx}"/><div>${esc(c)}</div>`;
        row.addEventListener("click",()=>{
          const ok=i===it.a;
          const fb=$("#readingFb"); fb.classList.remove("hidden"); fb.classList.toggle("ok",ok); fb.classList.toggle("no",!ok);
          fb.textContent = ok ? "✅ Correct!" : `❌ Hint: ${it.hint}`;
          if(ok) Score.award("read:"+idx,1);
        });
        ch.appendChild(row);
      });
      host.appendChild(block); host.appendChild(ch);
    });
  }

  // Reviews
  const REVIEW_PHRASES = {
    positive:["We had a wonderful stay.","The room was clean and comfortable.","The staff were friendly and helpful.","Breakfast was excellent.","I would definitely recommend this place."],
    negative:["Unfortunately, we had a problem.","The room was noisy at night.","The service was slow.","The food was undercooked.","I would not recommend this place."]
  };
  function renderReviewUI(){
    const sel=$("#revPlace"); sel.innerHTML="";
    const opts=[];
    PLACES.forEach(p=>opts.push({k:"place:"+p.id, t:"Place: "+p.title}));
    HOTELS.forEach(h=>opts.push({k:"hotel:"+h.id, t:"Hotel: "+h.name}));
    RESTS.forEach(r=>opts.push({k:"rest:"+r.id, t:"Restaurant: "+r.name+" ("+r.city+")"}));
    opts.forEach(o=>{ const op=document.createElement("option"); op.value=o.k; op.textContent=o.t; sel.appendChild(op); });
    $("#revPhrases").innerHTML = `
      <div style="font-weight:950;">Positive</div>
      <div class="muted" style="margin-top:.25rem">${REVIEW_PHRASES.positive.map(p=>"• "+esc(p)).join("<br/>")}</div>
      <div style="font-weight:950;margin-top:.65rem;">Negative</div>
      <div class="muted" style="margin-top:.25rem">${REVIEW_PHRASES.negative.map(p=>"• "+esc(p)).join("<br/>")}</div>`;
  }
  function buildReview(){
    const type=$("#revType").value;
    const stars=$("#revStars").value;
    const focus=$("#revFocus").value;
    const pick=$("#revPlace").value || "";
    const [kind,id]=pick.split(":");
    let name="the place";
    if(kind==="place") name=(PLACES.find(p=>p.id===id)?.title)||name;
    if(kind==="hotel") name=(HOTELS.find(h=>h.id===id)?.name)||"the hotel";
    if(kind==="rest") name=(RESTS.find(r=>r.id===id)?.name)||"the restaurant";
    const starText="★".repeat(parseInt(stars,10)) + "☆".repeat(5-parseInt(stars,10));
    const lines=[];
    lines.push(`${starText} (${stars}/5)`);
    if(type==="positive"){
      lines.push(`We had a wonderful time at ${name}.`);
      lines.push(`It was clean, comfortable, and well located.`);
      if(focus==="hotel") lines.push(`Breakfast was very good, and the staff were helpful.`);
      if(focus==="restaurant") lines.push(`The food was fresh and tasty, and the atmosphere was pleasant.`);
      lines.push(`I would definitely recommend it.`);
    } else {
      lines.push(`We stayed at ${name}, but unfortunately we had a problem.`);
      lines.push(`It was noisy at night, and we could not sleep well.`);
      if(focus==="hotel") lines.push(`The room was not as comfortable as we expected.`);
      if(focus==="restaurant") lines.push(`The service was slow and the food was not good.`);
      lines.push(`I would not recommend it.`);
    }
    $("#revOut").value = lines.join("\n");
    const fb=$("#revFb"); fb.classList.remove("hidden"); fb.classList.add("ok");
    fb.textContent="✅ Review created.";
    Score.award("review:"+type+":"+stars,2);
  }
  async function copyReview(){
    try{ await navigator.clipboard.writeText($("#revOut").value||""); const fb=$("#revFb"); fb.classList.remove("hidden"); fb.classList.add("ok"); fb.textContent="📋 Copied!"; }
    catch(e){ alert("Copy failed. Please copy manually."); }
  }

  function init(){
    Auto.load(); setAuto(Auto.enabled); setVoice("en-US");
    if(JS_STATUS) JS_STATUS.textContent="JS: ✅ loaded";

    on("#btnStart","click",()=>$("#sec1").scrollIntoView({behavior:"smooth"}));
    on("#btnHow","click",()=>alert("How to use:\n1) Places: select and speak 4 sentences.\n2) Hotels: compare.\n3) Restaurants: describe.\n4) Vocabulary: Reveal + Quick Check.\n5) Role-plays.\n6) Past simple + builder.\n7) Review at the end.\n\nAuto audio is OFF by default."));
    on("#voiceUS","click",()=>setVoice("en-US"));
    on("#voiceUK","click",()=>setVoice("en-GB"));
    on("#autoOff","click",()=>setAuto(false));
    on("#autoOn","click",()=>setAuto(true));
    on("#btnPause","click",()=>Speech.pause());
    on("#btnResume","click",()=>Speech.resume());
    on("#btnStop","click",()=>Speech.stop());
    on("#btnResetAll","click",()=>{ if(confirm("Reset ALL?")) location.reload(); });

    // places
    renderFilters();
    renderPlaceGrid();
    on("#regionSelect","change",(e)=>{ placeState.region=e.target.value; renderPlaceGrid(); });
    on("#themeSelect","change",(e)=>{ placeState.theme=e.target.value; renderPlaceGrid(); });
    on("#btnPlaceSpeak","click",()=>{ if(placeState.place) Speech.say((placeState.place.talk||[]).join(" ")); });
    on("#btnPlaceHint","click",()=>placeHelp());
    on("#btnPlaceDone","click",()=>{ if(placeState.place){ Score.award("place:"+placeState.place.id,2); const fb=$("#placeFb"); fb.classList.remove("hidden"); fb.classList.add("ok"); fb.textContent="✅ Done!"; }});
    on("#btnPlaceReset","click",()=>$("#placeFb").classList.add("hidden"));

    // hotels
    renderHotelFilters();
    renderHotelGrid();
    on("#hotelRegion","change",(e)=>{ hotelState.region=e.target.value; renderHotelGrid(); });
    on("#hotelBudget","change",(e)=>{ hotelState.budget=e.target.value; renderHotelGrid(); });
    on("#hotelBreakfast","change",(e)=>{ hotelState.breakfast=e.target.value; renderHotelGrid(); });
    on("#btnHotelSpeak","click",()=>Speech.say("Is breakfast included? What amenities do you have? We’d like a quiet room, please."));

    // restaurants
    renderRestCity();
    renderRestGrid();
    on("#restCity","change",(e)=>{ restState.city=e.target.value; renderRestGrid(); });
    on("#btnRestSpeak","click",()=>Speech.say("What is your signature dish? Do you have vegetarian options? Could I have the check, please?"));
    on("#btnFoodVocab","click",()=>showCanadianFood());

    // vocab + qc
    renderVocabCats();
    renderVocab();
    on("#vSearch","input",(e)=>{ vocabState.q=e.target.value; renderVocab(); });
    on("#vCat","change",(e)=>{ vocabState.cat=e.target.value; renderVocab(); });
    on("#btnVocabReset","click",()=>{ vocabState.q=""; vocabState.cat="all"; if($("#vSearch")) $("#vSearch").value=""; if($("#vCat")) $("#vCat").value="all"; renderVocab(); });
    on("#btnQCStart","click",()=>startQC());
    on("#btnQCHint","click",()=>{ const fb=$("#qcFb"); fb.classList.remove("hidden"); fb.classList.add("no"); fb.textContent="💡 " + qc.hint; });
    startQC();

    // roleplay
    renderRpSelect();
    on("#rpSelect","change",(e)=>{ rpState.key=e.target.value; $("#rpTitle").textContent="Role‑play: " + (currentRP()?.title||""); clearRP(); });
    on("#roleTeacher","click",()=>{ rpState.role="teacher"; $("#roleTeacher").classList.add("is-on"); $("#roleLearner").classList.remove("is-on"); });
    on("#roleLearner","click",()=>{ rpState.role="learner"; $("#roleLearner").classList.add("is-on"); $("#roleTeacher").classList.remove("is-on"); });
    on("#timerOff","click",()=>{ rpState.timer=false; $("#timerOff").classList.add("is-on"); $("#timerOn").classList.remove("is-on"); });
    on("#timerOn","click",()=>{ rpState.timer=true; $("#timerOn").classList.add("is-on"); $("#timerOff").classList.remove("is-on"); });
    on("#btnRPStart","click",()=>playRP());
    on("#btnRPStep","click",()=>stepRP());
    on("#btnRPClear","click",()=>clearRP());
    on("#btnRPModel","click",()=>showModel());
    on("#btnRPHint","click",()=>showHints());

    // past + builder
    renderPastRules();
    renderPastQuiz();
    renderBuildSelect();
    on("#buildSelect","change",()=>initBuilder());
    on("#btnBuildCheck","click",()=>checkBuilder());
    on("#btnBuildReset","click",()=>initBuilder());
    on("#btnBuildSpeak","click",()=>Speech.say(currentBuildTask().target));

    // listen/read
    renderListen();
    renderReading();
    on("#btnListenPlay","click",()=>Speech.say(LISTEN.script));
    on("#btnListenStop","click",()=>Speech.stop());
    on("#btnListenText","click",()=>{
      const box=$("#listenTextBox");
      const btn=$("#btnListenText");
      if(!box || !btn) return;
      const hidden=box.classList.contains("hidden");
      if(hidden){
        box.classList.remove("hidden");
        box.innerHTML = "<strong>Listening text:</strong><br/>" + esc(LISTEN.script);
        btn.textContent="🙈 Hide text";
      } else {
        box.classList.add("hidden");
        btn.textContent="📄 Show text";
      }
    });

    // reviews
    renderReviewUI();
    on("#btnRevBuild","click",()=>buildReview());
    on("#btnRevSpeak","click",()=>Speech.say($("#revOut").value||""));
    on("#btnRevCopy","click",()=>copyReview());

    upd();
  }
  init();
})();
