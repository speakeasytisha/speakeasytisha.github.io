/* SpeakEasyTisha — Eric Holland Trip Review Quest
   Build: 20260428
*/
(() => {
  "use strict";
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  const JS_STATUS = $("#jsStatus");
  const DEBUG = $("#debugBox");

  function logDebug(msg){
    try{
      if(!DEBUG) return;
      DEBUG.classList.remove("hidden");
      DEBUG.textContent += "\n" + msg;
    }catch(e){}
  }
  window.addEventListener("error", (e) => {
    try{ if(JS_STATUS) JS_STATUS.textContent = "JS: ❌ error"; }catch(_){}
    logDebug("[Error] " + e.message + " @ " + e.filename + ":" + e.lineno);
  });
  window.addEventListener("unhandledrejection", (e) => {
    try{ if(JS_STATUS) JS_STATUS.textContent = "JS: ❌ promise"; }catch(_){}
    logDebug("[Promise] " + String(e.reason));
  });

  function on(sel, evt, fn){
    const el = $(sel);
    if(!el){ logDebug("[Missing] " + sel); return null; }
    el.addEventListener(evt, fn);
    return el;
  }
  function esc(s){
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function norm(s){
    return String(s ?? "").replace(/[’']/g,"'").replace(/\s+/g," ").trim().toLowerCase();
  }
  function shuffle(a){
    const out = (a || []).slice();
    for(let i=out.length-1; i>0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  const Speech = {
    mode:"en-US",
    rate:0.96,
    stop(){ try{ window.speechSynthesis.cancel(); }catch(e){} },
    pause(){ try{ window.speechSynthesis.pause(); }catch(e){} },
    resume(){ try{ window.speechSynthesis.resume(); }catch(e){} },
    say(text){
      if(!window.speechSynthesis) return;
      const t = String(text || "").replace(/\s+/g," ").trim();
      if(!t) return;
      try{ window.speechSynthesis.cancel(); }catch(e){}
      const u = new SpeechSynthesisUtterance(t);
      u.lang = this.mode;
      u.rate = this.rate;
      window.speechSynthesis.speak(u);
    }
  };
  const Auto = {
    key:"eric_holland_auto_audio",
    enabled:false,
    load(){ this.enabled = localStorage.getItem(this.key) === "1"; },
    save(){ localStorage.setItem(this.key, this.enabled ? "1" : "0"); }
  };
  function setVoice(mode){
    Speech.mode = mode;
    $("#voiceUS")?.classList.toggle("is-on", mode === "en-US");
    $("#voiceUK")?.classList.toggle("is-on", mode === "en-GB");
    $("#voiceUS")?.setAttribute("aria-pressed", String(mode === "en-US"));
    $("#voiceUK")?.setAttribute("aria-pressed", String(mode === "en-GB"));
  }
  function setAuto(v){
    Auto.enabled = !!v;
    Auto.save();
    $("#autoOn")?.classList.toggle("is-on", Auto.enabled);
    $("#autoOff")?.classList.toggle("is-on", !Auto.enabled);
    $("#autoOn")?.setAttribute("aria-pressed", String(Auto.enabled));
    $("#autoOff")?.setAttribute("aria-pressed", String(!Auto.enabled));
  }

  const Score = {
    now:0,
    max:150,
    aw:new Set(),
    award(key, pts=1){
      if(this.aw.has(key)) return;
      this.aw.add(key);
      this.now += pts;
      updateScore();
    },
    reset(){ this.now = 0; this.aw.clear(); updateScore(); }
  };
  function updateScore(){
    const now = $("#scoreNow"), max = $("#scoreMax"), bar = $("#progressBar");
    if(now) now.textContent = String(Score.now);
    if(max) max.textContent = String(Score.max);
    if(bar){
      const pct = Score.max ? Math.round((Score.now / Score.max) * 100) : 0;
      bar.style.width = Math.max(0, Math.min(100, pct)) + "%";
    }
  }

  const AREAS = [
    {key:"all", label:"🇳🇱 All areas"},
    {key:"amsterdam", label:"🚲 Amsterdam"},
    {key:"north", label:"🌷 North Holland"},
    {key:"south", label:"🌬️ South Holland"},
    {key:"cities", label:"🏙️ Other cities"},
    {key:"villages", label:"🛶 Villages"}
  ];
  const THEMES = [
    {key:"all", label:"✨ All"},
    {key:"culture", label:"🏛️ Culture"},
    {key:"history", label:"📜 History"},
    {key:"nature", label:"🌿 Nature"},
    {key:"windmills", label:"🌬️ Windmills"},
    {key:"food", label:"🧀 Food + cafés"},
    {key:"city", label:"🚲 City life"},
    {key:"weather", label:"🌦️ Weather talk"}
  ];

  const PLACES = [
    {
      id:"amsterdam_canals", area:"amsterdam", icon:"🚲", theme:["city","culture","history","weather"],
      title:"Amsterdam canals + old streets", where:"Amsterdam · North Holland",
      why:"The canals, bridges and narrow houses make Amsterdam easy to describe and very photogenic.",
      say:"We walked along the canals, took pictures and stopped in cafés.",
      details:"Good for: walking, cafés, photos, bikes, museums nearby.",
      lines:[
        ["past simple", "We visited Amsterdam and walked along the canals."],
        ["past continuous", "We were taking pictures when it started to rain."],
        ["weather", "The weather was cloudy, but the city was still beautiful."],
        ["review", "I would recommend Amsterdam because it is lively and easy to explore."]
      ]
    },
    {
      id:"rijksmuseum", area:"amsterdam", icon:"🖼️", theme:["culture","history","city"],
      title:"Rijksmuseum", where:"Museumplein · Amsterdam",
      why:"A major museum for Dutch art and history, with famous Dutch masters.",
      say:"We visited the museum, saw paintings and learned about Dutch history.",
      details:"Good for: art, culture, rainy weather, calm indoor practice.",
      lines:[
        ["past simple", "We went to the Rijksmuseum and saw many famous paintings."],
        ["past continuous", "While we were looking at the paintings, I was trying to understand the story behind them."],
        ["present perfect", "I have never seen so much Dutch art in one place before."],
        ["review", "It was interesting, especially on a rainy day."]
      ]
    },
    {
      id:"zaanse_schans", area:"north", icon:"🌬️", theme:["windmills","history","food","culture"],
      title:"Zaanse Schans", where:"Near Amsterdam · North Holland",
      why:"A heritage area with windmills, traditional crafts, cheese, shops and Dutch atmosphere.",
      say:"We saw windmills, learned about traditional crafts and tasted cheese.",
      details:"Good for: windmills, photos, clogs, cheese, short day trip.",
      lines:[
        ["past simple", "We visited Zaanse Schans and saw traditional windmills."],
        ["past continuous", "People were making demonstrations while visitors were taking photos."],
        ["food", "We tasted cheese and looked at small local shops."],
        ["review", "It was touristy, but it was also beautiful and fun."]
      ]
    },
    {
      id:"kinderdijk", area:"south", icon:"💧", theme:["windmills","history","nature","weather"],
      title:"Kinderdijk windmills", where:"South Holland · UNESCO World Heritage area",
      why:"Kinderdijk shows how the Dutch have managed water and protected land for centuries.",
      say:"We walked near the water and saw many windmills in a peaceful landscape.",
      details:"Good for: history, water management, wind, photos, walking.",
      lines:[
        ["past simple", "We went to Kinderdijk and walked beside the water."],
        ["past continuous", "The wind was blowing while the windmills were turning."],
        ["present perfect", "The Dutch have managed water in this area for centuries."],
        ["review", "It was peaceful, impressive and very different from a normal city visit."]
      ]
    },
    {
      id:"keukenhof", area:"south", icon:"🌷", theme:["nature","weather"],
      title:"Keukenhof / tulip gardens", where:"Lisse · South Holland",
      why:"In spring, the tulip gardens are famous for colourful flowers and easy photo moments.",
      say:"We looked at the tulips and took photos of the colourful gardens.",
      details:"Good for: spring, flowers, colours, sunny/cloudy weather descriptions.",
      lines:[
        ["past simple", "We visited the tulip gardens and saw thousands of flowers."],
        ["past continuous", "The sun was shining while we were walking through the gardens."],
        ["weather", "It was mild and sunny, around fifteen degrees Celsius."],
        ["review", "It was one of the most colourful parts of the trip."]
      ]
    },
    {
      id:"the_hague", area:"south", icon:"🏛️", theme:["culture","history","city"],
      title:"The Hague", where:"South Holland",
      why:"The Hague is known for government buildings, museums and a more elegant city feeling.",
      say:"We visited the centre, saw beautiful buildings and enjoyed a quieter atmosphere.",
      details:"Good for: culture, museums, architecture, city contrast with Amsterdam.",
      lines:[
        ["past simple", "We spent a day in The Hague and visited the city centre."],
        ["past continuous", "People were going to work while we were discovering the streets."],
        ["comparison", "It felt calmer than Amsterdam."],
        ["review", "I liked the elegant atmosphere and the beautiful buildings."]
      ]
    },
    {
      id:"delft", area:"south", icon:"🔵", theme:["culture","history","food","city"],
      title:"Delft", where:"South Holland",
      why:"Delft is a charming historic city known for canals, blue pottery and a relaxed centre.",
      say:"We walked in the old town, saw canals and had a drink near the square.",
      details:"Good for: calm walking, cafés, souvenirs, small-town charm.",
      lines:[
        ["past simple", "We visited Delft and walked around the old town."],
        ["past continuous", "We were looking for a café when we found a beautiful square."],
        ["weather", "It was windy, so we stopped for a hot drink."],
        ["review", "Delft was charming, peaceful and easier to visit than a big city."]
      ]
    },
    {
      id:"utrecht", area:"cities", icon:"☕", theme:["city","culture","food"],
      title:"Utrecht", where:"Central Netherlands",
      why:"Utrecht has canals, cafés and a lively but relaxed atmosphere.",
      say:"We walked near the canals and had coffee in the city centre.",
      details:"Good for: cafés, shopping streets, casual conversation, comparing cities.",
      lines:[
        ["past simple", "We went to Utrecht and enjoyed the canals and cafés."],
        ["past continuous", "Students were talking outside while we were having coffee."],
        ["present perfect", "I have enjoyed discovering smaller Dutch cities."],
        ["review", "Utrecht felt friendly and less crowded than Amsterdam."]
      ]
    },
    {
      id:"giethoorn", area:"villages", icon:"🛶", theme:["nature","weather","city"],
      title:"Giethoorn", where:"Overijssel · village with waterways",
      why:"Giethoorn is famous for canals, small bridges and a peaceful village atmosphere.",
      say:"We took a boat, crossed small bridges and enjoyed the quiet scenery.",
      details:"Good for: boat trip, calm day, scenery, weather vocabulary.",
      lines:[
        ["past simple", "We visited Giethoorn and took a small boat."],
        ["past continuous", "We were crossing a bridge when the sky became cloudy."],
        ["weather", "It was rainy at first, but later it became brighter."],
        ["review", "It was very peaceful, but it can be crowded during the day."]
      ]
    }
  ];

  const VOCAB = [
    {cat:"places", ico:"🚲", w:"canal", fr:"canal", def:"a long waterway in a city or countryside", ex:"We walked along the canal in Amsterdam."},
    {cat:"places", ico:"🌉", w:"bridge", fr:"pont", def:"a structure over water or a road", ex:"We crossed many bridges."},
    {cat:"places", ico:"🌬️", w:"windmill", fr:"moulin à vent", def:"a traditional building with sails moved by the wind", ex:"We saw windmills at Zaanse Schans."},
    {cat:"places", ico:"🖼️", w:"museum", fr:"musée", def:"a place where you see art, history or objects", ex:"We visited a museum on a rainy day."},
    {cat:"places", ico:"🏛️", w:"monument", fr:"monument", def:"an important building or statue", ex:"Which monument did you visit?"},
    {cat:"places", ico:"🧀", w:"cheese shop", fr:"fromagerie / magasin de fromage", def:"a shop where you can buy cheese", ex:"We stopped at a cheese shop."},
    {cat:"places", ico:"☕", w:"café", fr:"café", def:"a place where you can drink coffee or eat something small", ex:"We had a coffee in a small café."},
    {cat:"weather", ico:"☀️", w:"sunny", fr:"ensoleillé", def:"with a lot of sun", ex:"It was sunny in the afternoon."},
    {cat:"weather", ico:"☁️", w:"cloudy", fr:"nuageux", def:"with many clouds", ex:"The weather was cloudy but pleasant."},
    {cat:"weather", ico:"🌧️", w:"rainy", fr:"pluvieux", def:"with rain", ex:"It was rainy, so we visited a museum."},
    {cat:"weather", ico:"💨", w:"windy", fr:"venteux", def:"with a lot of wind", ex:"It was windy near the water."},
    {cat:"weather", ico:"🌡️", w:"temperature", fr:"température", def:"how hot or cold it is", ex:"The temperature was around twelve degrees."},
    {cat:"weather", ico:"℃", w:"Celsius", fr:"degrés Celsius", def:"temperature scale used in France and the Netherlands", ex:"It was about ten degrees Celsius."},
    {cat:"travel", ico:"🧳", w:"trip", fr:"voyage / séjour", def:"a journey or visit", ex:"How was your trip to Holland?"},
    {cat:"travel", ico:"⏳", w:"duration", fr:"durée", def:"how long something lasts", ex:"What was the duration of your trip?"},
    {cat:"travel", ico:"📅", w:"for three days", fr:"pendant trois jours", def:"duration expression", ex:"We stayed for three days."},
    {cat:"travel", ico:"🗓️", w:"since", fr:"depuis", def:"from a point in time until now", ex:"I have wanted to visit Holland since last year."},
    {cat:"travel", ico:"🕰️", w:"so far", fr:"jusqu’à présent", def:"until now", ex:"It has been a great trip so far."},
    {cat:"grammar", ico:"✅", w:"visited", fr:"a visité / avons visité", def:"past simple of visit", ex:"We visited Amsterdam."},
    {cat:"grammar", ico:"🚶", w:"were walking", fr:"étions en train de marcher", def:"past continuous", ex:"We were walking when it started to rain."},
    {cat:"grammar", ico:"✨", w:"have visited", fr:"ai / avons visité", def:"present perfect", ex:"I have visited the Netherlands."},
    {cat:"review", ico:"⭐", w:"highlight", fr:"temps fort", def:"the best part of an experience", ex:"The highlight was the windmill village."},
    {cat:"review", ico:"📸", w:"photogenic", fr:"photogénique", def:"good for pictures", ex:"The canals were very photogenic."},
    {cat:"review", ico:"👥", w:"crowded", fr:"bondé", def:"with many people", ex:"Amsterdam was crowded in some areas."},
    {cat:"review", ico:"😌", w:"peaceful", fr:"paisible", def:"calm and quiet", ex:"Kinderdijk was peaceful."},
    {cat:"review", ico:"👍", w:"recommend", fr:"recommander", def:"to say that something is good", ex:"I would recommend Holland for a short trip."},
    {cat:"review", ico:"⚖️", w:"mixed feelings", fr:"avis partagé", def:"positive and negative feelings together", ex:"I had mixed feelings because it was beautiful but crowded."}
  ];

  const GRAMMAR_Q = [
    {q:"We ____ Amsterdam last weekend.", choices:["visit","visited","have visited"], a:1, hint:"A finished time: last weekend → past simple."},
    {q:"While we ____ along the canal, it started to rain.", choices:["walked","were walking","have walked"], a:1, hint:"Action in progress + when something happened → past continuous."},
    {q:"I ____ never ____ so many bikes before.", choices:["did / see","was / seeing","have / seen"], a:2, hint:"Life experience up until now → present perfect."},
    {q:"We didn’t ____ the museum because it was closed.", choices:["visited","visit","visiting"], a:1, hint:"After didn’t → base verb."},
    {q:"The weather ____ cloudy in the morning.", choices:["was","were","has been"], a:0, hint:"Weather = it was / the weather was."},
    {q:"They ____ taking photos when the guide arrived.", choices:["was","were","have been"], a:1, hint:"They → were + verb-ing."},
    {q:"So far, the trip ____ very interesting.", choices:["was","has been","were"], a:1, hint:"So far = from the beginning until now → present perfect."},
    {q:"Did you ____ any cheese in Holland?", choices:["try","tried","trying"], a:0, hint:"Did + subject + base verb."}
  ];

  const BUILD_TASKS = [
    {title:"Past simple", target:"We visited Amsterdam and walked along the canals.", tokens:["We","visited","Amsterdam","and","walked","along","the","canals."]},
    {title:"Past continuous", target:"We were walking when it started to rain.", tokens:["We","were","walking","when","it","started","to","rain."]},
    {title:"Present perfect", target:"I have never seen so many bikes before.", tokens:["I","have","never","seen","so","many","bikes","before."]},
    {title:"Trip duration", target:"We stayed in Holland for four days.", tokens:["We","stayed","in","Holland","for","four","days."]},
    {title:"Review sentence", target:"I would recommend it because it was beautiful and easy to visit.", tokens:["I","would","recommend","it","because","it","was","beautiful","and","easy","to","visit."]}
  ];

  const READINGS = [
    {
      key:"short", title:"A short trip review (A2)",
      text:[
        "Last week, we went to Holland for a short trip. We stayed for four days and visited Amsterdam, Zaanse Schans and Delft.",
        "The weather was cloudy and windy, but it did not ruin the trip. We walked along the canals, took photos of the bridges and stopped in small cafés.",
        "My favourite part was Zaanse Schans because we saw windmills and tasted cheese. I would recommend Holland because it is easy to visit and very different from France."
      ],
      fr:"La semaine dernière, nous sommes allés en Hollande pour un court séjour. Le texte utilise surtout le past simple pour raconter les actions terminées : went, stayed, visited, walked, took, stopped.",
      q:[
        {q:"How long did they stay?", choices:["Four days","Two weeks","One month"], a:0, hint:"Look at paragraph 1."},
        {q:"What was the weather like?", choices:["Cloudy and windy","Hot and sunny","Snowy"], a:0, hint:"Paragraph 2."},
        {q:"What was the favourite part?", choices:["Zaanse Schans","The airport","The hotel"], a:0, hint:"Paragraph 3."}
      ]
    },
    {
      key:"story", title:"A story moment with past continuous (A2+)",
      text:[
        "On the second day, we were walking near the canals in Amsterdam when it suddenly started to rain. We did not have an umbrella, so we ran into a small café.",
        "While we were drinking coffee, we looked at the map and changed our plan. Instead of walking outside, we visited the Rijksmuseum in the afternoon.",
        "In the end, the rainy day became one of the best memories of the trip because we discovered something we had not planned."
      ],
      fr:"Ce texte utilise le past continuous pour le décor ou l’action en cours : were walking, were drinking. Le past simple montre l’action courte : started, ran, visited, became.",
      q:[
        {q:"What were they doing when it started to rain?", choices:["Walking near the canals","Buying shoes","Leaving the country"], a:0, hint:"First sentence."},
        {q:"Where did they go because of the rain?", choices:["A café, then the museum","A beach","A football stadium"], a:0, hint:"Paragraph 1 and 2."},
        {q:"Why was it a good memory?", choices:["They discovered something unplanned","They slept all day","They missed the train"], a:0, hint:"Last sentence."}
      ]
    },
    {
      key:"perfect", title:"Up until now: present perfect review (A2+/B1)",
      text:[
        "I have visited several places in the Netherlands now, and I have enjoyed the mix of canals, museums, windmills and cafés.",
        "So far, the most impressive place has been Kinderdijk because the landscape shows how important water management has been in Dutch history.",
        "I have learned that Holland is not only Amsterdam. Smaller cities and villages have also been very interesting, especially when the weather has been mild."
      ],
      fr:"Ce texte utilise le present perfect avec up until now / so far : have visited, have enjoyed, has been, have learned. On parle de l’expérience jusqu’à maintenant.",
      q:[
        {q:"What mix did the speaker enjoy?", choices:["Canals, museums, windmills and cafés","Only beaches","Only shopping centres"], a:0, hint:"Paragraph 1."},
        {q:"Which place was the most impressive so far?", choices:["Kinderdijk","London","Paris"], a:0, hint:"Paragraph 2."},
        {q:"What has the speaker learned?", choices:["Holland is not only Amsterdam","There are no canals","The weather is always hot"], a:0, hint:"Paragraph 3."}
      ]
    }
  ];

  const MODEL_TEXTS = [
    {
      key:"positive", label:"Positive review", models:{
        "A2":"I went to Holland for a short trip. We stayed for four days. We visited Amsterdam and saw beautiful canals. We also went to Zaanse Schans and saw windmills. The weather was cloudy but pleasant. I liked the cafés, the bridges and the cheese. I would recommend Holland because it is easy to visit and very beautiful.",
        "A2+":"Last week, I went to Holland for a short trip and stayed for four days. We visited Amsterdam, walked along the canals and stopped in small cafés. We also went to Zaanse Schans, where we saw windmills and tasted cheese. The weather was cloudy and windy, but it did not spoil the trip. I would recommend Holland because it is beautiful, interesting and easy to explore.",
        "B1":"I recently travelled to Holland for a long weekend, and it was a very positive experience. We spent time in Amsterdam, visited museums, walked along the canals and took a day trip to see the windmills. While we were exploring the city, the weather changed several times, but that actually made the trip feel more authentic. I have visited several European cities, but Holland has a special atmosphere because it mixes history, water, bikes and relaxed cafés. I would definitely recommend it."
      }
    },
    {
      key:"rainy", label:"Rainy-day story", models:{
        "A2":"The weather was rainy during part of our trip. We were walking in Amsterdam when it started to rain. We did not have an umbrella, so we went into a café. After that, we visited a museum. It was not perfect, but it was still a good day.",
        "A2+":"On the second day, it was cloudy and rainy. We were walking near the canals when it suddenly started to rain, so we stopped in a café and changed our plan. In the afternoon, we visited the Rijksmuseum instead of walking outside. In the end, the rainy day was useful because we discovered a very interesting museum.",
        "B1":"One of the most memorable moments happened during a rainy afternoon in Amsterdam. We were walking along the canals and taking photos when the sky suddenly became very dark. Since we did not have an umbrella, we quickly found a small café and looked at the map. Instead of feeling disappointed, we changed our plan and visited the Rijksmuseum. The weather was not ideal, but it helped us discover something cultural and meaningful."
      }
    },
    {
      key:"mixed", label:"Mixed review", models:{
        "A2":"I liked Holland, but some places were very crowded. Amsterdam was beautiful, but there were many people. The weather was windy and sometimes rainy. My favourite part was the windmills because the place was peaceful. I would recommend Holland, but I would go early in the morning.",
        "A2+":"I had mixed feelings about Holland. I loved the canals, cafés and windmills, but some places in Amsterdam were crowded. The weather was also changeable: sometimes sunny, sometimes rainy and windy. The best moment was visiting Kinderdijk because it was quieter and very impressive. I would recommend Holland, but I would plan the visits carefully and avoid the busiest hours.",
        "B1":"Overall, I enjoyed Holland, but I would describe the experience as a mix of beautiful discoveries and a few practical challenges. Amsterdam was lively and photogenic, but it was also crowded in several areas. While we were walking through the centre, we sometimes had to slow down because of bikes and tourists. However, places like Kinderdijk and Delft felt calmer and more authentic. I have learned that Holland is easier to enjoy when you combine famous sights with smaller, quieter places."
      }
    },
    {
      key:"museum", label:"Museum + culture review", models:{
        "A2":"We visited a museum in Amsterdam. It was very interesting. We saw paintings and learned about Dutch history. The museum was a good idea because the weather was rainy. I liked it because it was calm and beautiful.",
        "A2+":"During our trip, we visited the Rijksmuseum in Amsterdam. It was a very good choice because the weather was rainy in the afternoon. We saw famous paintings and learned more about Dutch history. I have always liked museums, and this one was calm, beautiful and well organized.",
        "B1":"A strong cultural highlight of the trip was the Rijksmuseum. We went there on a rainy afternoon, which was perfect because it gave us time to slow down and focus on Dutch art and history. While we were walking through the galleries, I realised how much the museum helps visitors understand the country. I have visited other museums before, but this one felt especially connected to the place and the trip."
      }
    }
  ];
  const LEVELS = ["A2","A2+","B1"];

  const ROLES = [
    {
      key:"teacher_chat", title:"Teacher chat: How was your trip?",
      phrases:["I went to Holland for…","We stayed for…","We visited…","The weather was…","The highlight was…","I would recommend it because…"],
      lines:[
        {who:"Teacher", side:"a", say:"Hi Eric! Welcome back. How was your trip to Holland?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"It was great, thank you. We stayed for four days and visited Amsterdam and the windmills."},
        {who:"Teacher", side:"a", say:"Nice! What did you visit first?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"First, we visited Amsterdam. We walked along the canals and stopped in cafés."},
        {who:"Teacher", side:"a", say:"What was the weather like?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"It was cloudy and windy, but it was still pleasant."},
        {who:"Teacher", side:"a", say:"What was the highlight of the trip?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"The highlight was Zaanse Schans because we saw windmills and tasted cheese."}
      ]
    },
    {
      key:"story_problem", title:"Storytelling: something happened",
      phrases:["We were walking when…","It started to rain.","We decided to…","In the end…","It became a good memory."],
      lines:[
        {who:"Friend", side:"a", say:"Tell me one funny or surprising moment from Holland."},
        {who:"Eric", side:"b", say:"(Your turn)", model:"We were walking near the canals when it suddenly started to rain."},
        {who:"Friend", side:"a", say:"Oh no! What did you do?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"We ran into a café, had a coffee and changed our plan."},
        {who:"Friend", side:"a", say:"Was the day ruined?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"No, not really. In the afternoon, we visited a museum, and it became a good memory."}
      ]
    },
    {
      key:"recommend", title:"Recommendation: Should I go to Holland?",
      phrases:["I would recommend…","You should visit…","If the weather is rainy…","It can be crowded, so…","The best place for me was…"],
      lines:[
        {who:"Colleague", side:"a", say:"I’m thinking about going to Holland. Would you recommend it?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"Yes, I would recommend it. It is beautiful, interesting and easy to visit."},
        {who:"Colleague", side:"a", say:"What should I visit?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"You should visit Amsterdam, Zaanse Schans and maybe Delft if you want a calmer city."},
        {who:"Colleague", side:"a", say:"What about the weather?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"Bring a jacket and an umbrella because it can be windy or rainy."}
      ]
    },
    {
      key:"review_interview", title:"Mini interview: full review",
      phrases:["I have visited…","So far, I have learned…","The most impressive place was…","While we were…","I would go back because…"],
      lines:[
        {who:"Interviewer", side:"a", say:"Can you give me a short review of your trip?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"I have visited several places in Holland now, and I really enjoyed the mix of canals, museums and windmills."},
        {who:"Interviewer", side:"a", say:"What was the most impressive place?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"The most impressive place was Kinderdijk because the windmills and the water were beautiful."},
        {who:"Interviewer", side:"a", say:"What would you change next time?"},
        {who:"Eric", side:"b", say:"(Your turn)", model:"Next time, I would plan more time in smaller cities because Amsterdam was quite crowded."}
      ]
    }
  ];

  // Section 1: Places
  const placeState = {area:"all", theme:"all", place:null};
  function renderPlaceFilters(){
    const a = $("#placeArea"), t = $("#placeTheme");
    if(!a || !t) return;
    a.innerHTML = AREAS.map(x => `<option value="${esc(x.key)}">${esc(x.label)}</option>`).join("");
    t.innerHTML = THEMES.map(x => `<option value="${esc(x.key)}">${esc(x.label)}</option>`).join("");
    a.value = placeState.area;
    t.value = placeState.theme;
  }
  function filteredPlaces(){
    return PLACES.filter(p => (placeState.area === "all" || p.area === placeState.area) && (placeState.theme === "all" || p.theme.includes(placeState.theme)));
  }
  function renderPlaceGrid(){
    const grid = $("#placeGrid");
    if(!grid) return;
    const list = filteredPlaces();
    if(!list.length){ grid.innerHTML = `<div class="empty">No place found. Try another filter.</div>`; return; }
    grid.innerHTML = list.map(p => `
      <button class="place-tile ${placeState.place && placeState.place.id === p.id ? "is-on" : ""}" data-place="${esc(p.id)}" type="button">
        <div>
          <div class="place-tile__icon">${esc(p.icon)}</div>
          <div class="place-tile__title">${esc(p.title)}</div>
          <div class="place-tile__meta">${esc(p.where)}</div>
        </div>
        <div class="place-tile__tags">${p.theme.slice(0,3).map(x => `<span class="tagmini">${esc(x)}</span>`).join("")}</div>
      </button>`).join("");
    $$(".place-tile", grid).forEach(btn => {
      btn.addEventListener("click", () => selectPlace(btn.dataset.place));
    });
    if(!placeState.place) selectPlace(list[0].id, false);
  }
  function selectPlace(id, speak=true){
    const p = PLACES.find(x => x.id === id) || filteredPlaces()[0] || PLACES[0];
    placeState.place = p;
    $$(".place-tile").forEach(b => b.classList.toggle("is-on", b.dataset.place === p.id));
    $("#placeTitle").textContent = `${p.icon} ${p.title}`;
    $("#placeWhere").textContent = p.where;
    $("#placeWhy").textContent = p.why;
    $("#placeSay").textContent = p.say;
    $("#placeDetails").textContent = p.details;
    $("#placeBadges").innerHTML = p.theme.map(x => `<span class="badge">${esc(themeLabel(x))}</span>`).join("");
    $("#placeModelLines").innerHTML = p.lines.map((line, idx) => `
      <div class="model-line">
        <div>${idx+1}</div>
        <div><strong>${esc(line[0])}</strong>${esc(line[1])}</div>
        <button class="toolmini" data-say="${esc(line[1])}" type="button">🔊</button>
      </div>`).join("");
    $$("#placeModelLines [data-say]").forEach(b => b.addEventListener("click", () => Speech.say(b.dataset.say)));
    if(Auto.enabled && speak) Speech.say(p.lines.map(x => x[1]).join(" "));
  }
  function themeLabel(key){
    const m = THEMES.find(x => x.key === key);
    return m ? m.label : key;
  }
  function placeHelp(){
    const p = placeState.place || PLACES[0];
    const fb = $("#placeFb");
    fb.className = "feedback ok";
    fb.innerHTML = `Try this pattern:<br><strong>1)</strong> We went to ${esc(p.title)}.<br><strong>2)</strong> We visited / saw / walked / tasted…<br><strong>3)</strong> While we were…, it…<br><strong>4)</strong> I would recommend it because…`;
  }

  // Section 2: Vocabulary
  function renderVocabCats(){
    const cats = ["all", ...Array.from(new Set(VOCAB.map(v => v.cat)))];
    const sel = $("#vocabCat");
    if(!sel) return;
    sel.innerHTML = cats.map(c => `<option value="${esc(c)}">${c === "all" ? "✨ All" : esc(c)}</option>`).join("");
  }
  function visibleVocab(){
    const q = norm($("#vocabSearch")?.value || "");
    const cat = $("#vocabCat")?.value || "all";
    return VOCAB.filter(v => (cat === "all" || v.cat === cat) && (!q || norm(`${v.w} ${v.fr} ${v.def} ${v.ex} ${v.cat}`).includes(q)));
  }
  function renderVocab(){
    const grid = $("#vocabGrid");
    if(!grid) return;
    const list = visibleVocab();
    if(!list.length){ grid.innerHTML = `<div class="empty">No vocabulary found.</div>`; return; }
    grid.innerHTML = list.map((v, idx) => `
      <article class="flashcard" data-vocab="${idx}">
        <div class="fcTop">
          <div><div class="fcIcon">${esc(v.ico)}</div><div class="fcWord">${esc(v.w)}</div><div class="fcCat">${esc(v.cat)}</div></div>
          <button class="toolmini" data-vsay="${esc(v.w + ". " + v.ex)}" type="button">🔊</button>
        </div>
        <div class="fcDef"><strong>FR:</strong> ${esc(v.fr)}</div>
        <div class="fcDef hidden"><strong>Definition:</strong> ${esc(v.def)}</div>
        <div class="fcEx hidden"><strong>Example:</strong> ${esc(v.ex)}</div>
        <div class="fcBtns">
          <button class="hintbtn" data-reveal type="button">Reveal</button>
          <button class="iconbtn" data-hide type="button">Hide</button>
        </div>
      </article>`).join("");
    $$("[data-vsay]", grid).forEach(b => b.addEventListener("click", () => Speech.say(b.dataset.vsay)));
    $$("[data-reveal]", grid).forEach(b => b.addEventListener("click", () => {
      const card = b.closest(".flashcard");
      $$(".hidden", card).forEach(el => el.classList.remove("hidden"));
      Score.award("vocab:" + $(".fcWord", card).textContent, 1);
    }));
    $$("[data-hide]", grid).forEach(b => b.addEventListener("click", () => {
      const card = b.closest(".flashcard");
      $$(".fcDef:not(:first-of-type), .fcEx", card).forEach(el => el.classList.add("hidden"));
    }));
  }

  // Section 3: Grammar quiz and builder
  function renderGrammarQuiz(){
    const host = $("#grammarQuiz");
    if(!host) return;
    host.innerHTML = GRAMMAR_Q.map((q, i) => `
      <div class="kcard" style="margin-bottom:.55rem">
        <div style="font-weight:1000">${i+1}. ${esc(q.q)}</div>
        ${q.choices.map((c, j) => `<label class="choice"><input type="radio" name="g${i}" value="${j}"><span>${esc(c)}</span></label>`).join("")}
        <button class="toolmini" data-ghint="${i}" type="button">💡 Hint</button>
      </div>`).join("") + `<button class="btn" id="btnGrammarCheck" type="button">✅ Check grammar</button>`;
    on("#btnGrammarCheck", "click", checkGrammar);
    $$('[data-ghint]', host).forEach(b => b.addEventListener("click", () => {
      const q = GRAMMAR_Q[Number(b.dataset.ghint)];
      const fb = $("#grammarFb");
      fb.className = "feedback ok";
      fb.textContent = "💡 " + q.hint;
    }));
  }
  function checkGrammar(){
    let good = 0;
    GRAMMAR_Q.forEach((q, i) => {
      const checked = $(`input[name="g${i}"]:checked`);
      const labels = $$(`input[name="g${i}"]`).map(inp => inp.closest(".choice"));
      labels.forEach(l => l.classList.remove("ok", "no"));
      if(checked){
        const isGood = Number(checked.value) === q.a;
        checked.closest(".choice").classList.add(isGood ? "ok" : "no");
        labels[q.a]?.classList.add("ok");
        if(isGood) good++;
      }
    });
    const fb = $("#grammarFb");
    fb.className = "feedback " + (good === GRAMMAR_Q.length ? "ok" : "no");
    fb.textContent = `Result: ${good}/${GRAMMAR_Q.length}. ${good === GRAMMAR_Q.length ? "Excellent!" : "Check the green answers and try again."}`;
    Score.award("grammar:" + good, good);
  }

  let buildState = {idx:0, out:[]};
  function renderBuildSelect(){
    const sel = $("#buildSelect");
    if(!sel) return;
    sel.innerHTML = BUILD_TASKS.map((t, i) => `<option value="${i}">${esc(t.title)}</option>`).join("");
  }
  function renderBuilder(){
    const task = BUILD_TASKS[buildState.idx] || BUILD_TASKS[0];
    const host = $("#builderHost");
    buildState.out = [];
    if(!host) return;
    const shuffled = shuffle(task.tokens.map((tok, i) => ({tok, id:i})));
    host.innerHTML = `
      <div class="builder">
        <div class="bank"><div class="bankTitle">Word bank</div><div id="tokenBank">${shuffled.map(x => `<button class="token" data-id="${x.id}" data-token="${esc(x.tok)}" type="button">${esc(x.tok)}</button>`).join("")}</div></div>
        <div class="dropzone"><div class="bankTitle">Your sentence</div><div id="sentenceOut"></div></div>
      </div>`;
    $$("#tokenBank .token").forEach(btn => btn.addEventListener("click", () => addToken(btn)));
    $("#buildFb")?.classList.add("hidden");
  }
  function addToken(btn){
    buildState.out.push({id:btn.dataset.id, tok:btn.dataset.token});
    btn.classList.add("is-used");
    const out = $("#sentenceOut");
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "token out";
    pill.textContent = btn.dataset.token;
    pill.dataset.id = btn.dataset.id;
    pill.title = "Tap to remove";
    pill.addEventListener("click", () => {
      buildState.out = buildState.out.filter(x => x.id !== pill.dataset.id);
      $(`#tokenBank .token[data-id="${pill.dataset.id}"]`)?.classList.remove("is-used");
      pill.remove();
    });
    out.appendChild(pill);
  }
  function checkBuilder(){
    const task = BUILD_TASKS[buildState.idx] || BUILD_TASKS[0];
    const made = buildState.out.map(x => x.tok).join(" ");
    const fb = $("#buildFb");
    const ok = norm(made) === norm(task.target);
    fb.className = "feedback " + (ok ? "ok" : "no");
    fb.innerHTML = ok ? "✅ Perfect!" : `❌ Try again.<br><strong>Target:</strong> ${esc(task.target)}<br><strong>Your sentence:</strong> ${esc(made || "—")}`;
    if(ok) Score.award("build:" + buildState.idx, 3);
  }

  // Section 4: Readings
  function renderReadingSelect(){
    const sel = $("#readingSelect");
    if(!sel) return;
    sel.innerHTML = READINGS.map((r, i) => `<option value="${i}">${esc(r.title)}</option>`).join("");
  }
  function renderReading(){
    const idx = Number($("#readingSelect")?.value || 0);
    const r = READINGS[idx] || READINGS[0];
    $("#readingTitle").textContent = r.title;
    $("#readingText").innerHTML = r.text.map(p => `<p>${esc(p)}</p>`).join("");
    $("#readingFr").textContent = r.fr;
    $("#readingFr").classList.add("hidden");
    $("#readingQuestions").innerHTML = r.q.map((q, i) => `
      <div class="kcard" style="margin-bottom:.55rem">
        <div style="font-weight:1000">${i+1}. ${esc(q.q)}</div>
        ${q.choices.map((c, j) => `<label class="choice"><input type="radio" name="r${i}" value="${j}"><span>${esc(c)}</span></label>`).join("")}
        <button class="toolmini" data-rhint="${i}" type="button">💡 Hint</button>
      </div>`).join("") + `<button class="btn" id="btnReadingCheck" type="button">✅ Check answers</button>`;
    on("#btnReadingCheck", "click", () => checkReading(r));
    $$('[data-rhint]').forEach(b => b.addEventListener("click", () => {
      const fb = $("#readingFb");
      const q = r.q[Number(b.dataset.rhint)];
      fb.className = "feedback ok";
      fb.textContent = "💡 " + q.hint;
    }));
    $("#readingFb").classList.add("hidden");
  }
  function checkReading(r){
    let good = 0;
    r.q.forEach((q, i) => {
      const checked = $(`input[name="r${i}"]:checked`);
      const labels = $$(`input[name="r${i}"]`).map(inp => inp.closest(".choice"));
      labels.forEach(l => l.classList.remove("ok", "no"));
      if(checked){
        const isGood = Number(checked.value) === q.a;
        checked.closest(".choice").classList.add(isGood ? "ok" : "no");
        labels[q.a]?.classList.add("ok");
        if(isGood) good++;
      }
    });
    const fb = $("#readingFb");
    fb.className = "feedback " + (good === r.q.length ? "ok" : "no");
    fb.textContent = `Result: ${good}/${r.q.length}.`;
    Score.award("reading:" + r.key + ":" + good, good * 2);
  }

  // Section 5: Model texts
  function renderModelSelects(){
    $("#modelSituation").innerHTML = MODEL_TEXTS.map(m => `<option value="${esc(m.key)}">${esc(m.label)}</option>`).join("");
    $("#modelLevel").innerHTML = LEVELS.map(l => `<option value="${esc(l)}">${esc(l)}</option>`).join("");
    $("#modelLevel").value = "A2+";
  }
  function currentModel(){
    const key = $("#modelSituation")?.value || MODEL_TEXTS[0].key;
    const level = $("#modelLevel")?.value || "A2+";
    const item = MODEL_TEXTS.find(m => m.key === key) || MODEL_TEXTS[0];
    return {item, level, text:item.models[level] || item.models["A2+"]};
  }
  function renderModel(){
    const {item, level, text} = currentModel();
    $("#modelTitle").textContent = item.label;
    $("#modelText").innerHTML = `<span class="levelTag">${esc(level)}</span>\n${esc(text)}`;
    $("#modelFb").classList.add("hidden");
  }
  async function copyText(text, fbSel){
    try{
      await navigator.clipboard.writeText(text);
      const fb = $(fbSel);
      if(fb){ fb.className = "feedback ok"; fb.textContent = "📋 Copied!"; }
    }catch(e){
      const fb = $(fbSel);
      if(fb){ fb.className = "feedback no"; fb.textContent = "Copy failed. Please select and copy manually."; }
    }
  }

  // Section 6: Role plays
  const roleState = {idx:0, step:0, current:null, lastModel:""};
  function renderRoleSelect(){
    const sel = $("#roleSelect");
    if(!sel) return;
    sel.innerHTML = ROLES.map((r, i) => `<option value="${i}">${esc(r.title)}</option>`).join("");
  }
  function startRole(){
    roleState.idx = Number($("#roleSelect")?.value || 0);
    roleState.current = ROLES[roleState.idx] || ROLES[0];
    roleState.step = 0;
    roleState.lastModel = "";
    $("#roleTitle").textContent = roleState.current.title;
    $("#chatStream").innerHTML = "";
    $("#roleHelpBox").textContent = "Click Next. Try your answer before showing the model.";
    nextRole();
  }
  function nextRole(){
    const r = roleState.current || ROLES[Number($("#roleSelect")?.value || 0)] || ROLES[0];
    roleState.current = r;
    if(roleState.step >= r.lines.length){
      $("#roleHelpBox").textContent = "Scenario complete! Try again without the model, or choose another scenario.";
      Score.award("role:" + r.key, 5);
      return;
    }
    const line = r.lines[roleState.step];
    roleState.lastModel = line.model || "";
    addBubble(line);
    roleState.step++;
  }
  function addBubble(line){
    const chat = $("#chatStream");
    const div = document.createElement("div");
    div.className = "bubble " + (line.side || "a");
    div.innerHTML = `<div class="who">${line.side === "b" ? "🧑‍🎓" : "👩‍🏫"} ${esc(line.who)}</div><div class="txt">${esc(line.say)}</div><div class="tools"><button class="toolmini" type="button">🔊 Listen</button></div>`;
    $("button", div).addEventListener("click", () => Speech.say(line.model || line.say));
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    if(Auto.enabled) Speech.say(line.model || line.say);
  }
  function showRoleModel(){
    const box = $("#roleHelpBox");
    if(!roleState.lastModel){ box.textContent = "No model needed for this line. Click Next."; return; }
    box.innerHTML = `<strong>Model reply:</strong><br>${esc(roleState.lastModel)}<div style="margin-top:.4rem"><button class="toolmini" id="btnModelVoice" type="button">🔊 Listen model</button></div>`;
    on("#btnModelVoice", "click", () => Speech.say(roleState.lastModel));
    Score.award("roleModel", 1);
  }
  function showRolePhrases(){
    const r = roleState.current || ROLES[Number($("#roleSelect")?.value || 0)] || ROLES[0];
    $("#roleHelpBox").innerHTML = `<strong>Useful phrases:</strong><br>${r.phrases.map(p => "• " + esc(p)).join("<br>")}`;
  }
  let timer = null;
  function runTimer(sel, seconds){
    clearInterval(timer);
    let n = seconds;
    const el = $(sel);
    if(!el) return;
    el.textContent = String(n);
    timer = setInterval(() => {
      n -= 1;
      el.textContent = String(Math.max(0,n));
      if(n <= 0){ clearInterval(timer); Speech.say("Time is up."); }
    }, 1000);
  }

  // Section 7: Summary
  function buildSummary(){
    const duration = $("#sumDuration").value;
    const weather = $("#sumWeather").value;
    const places = $("#sumPlaces").value;
    const opinion = $("#sumOpinion").value;
    const txt = `I went to Holland ${duration}. The weather was ${weather}. We visited ${places}. We walked a lot, took photos and stopped in cafés. While we were exploring, we discovered beautiful canals, bridges and Dutch architecture. I have enjoyed learning more about the Netherlands because it is ${opinion}. The highlight of the trip was seeing a different atmosphere from France. I would recommend Holland for a short trip, especially if you like culture, water views and easy city walks.`;
    $("#summaryText").value = txt;
    Score.award("summaryBuild", 3);
  }
  function checkSummary(){
    const t = $("#summaryText").value || "";
    const checks = [
      {label:"Mentions duration (for three days / for one week / long weekend)", ok:/\bfor\b|weekend|days|week/i.test(t)},
      {label:"Mentions weather (sunny, cloudy, rainy, windy, Celsius, temperature)", ok:/sunny|cloudy|rainy|windy|celsius|temperature|weather|mild|cold/i.test(t)},
      {label:"Uses past simple (went, visited, stayed, saw, walked, took, stopped)", ok:/\b(went|visited|stayed|saw|walked|took|stopped|liked|loved|spent|had)\b/i.test(t)},
      {label:"Uses past continuous (was/were + verb-ing)", ok:/\b(was|were)\s+\w+ing\b/i.test(t)},
      {label:"Uses present perfect (have/has + past participle)", ok:/\b(have|has)\s+(visited|seen|been|enjoyed|learned|learnt|discovered|wanted)\b/i.test(t)},
      {label:"Gives an opinion / recommendation", ok:/recommend|liked|enjoyed|beautiful|interesting|memorable|great|would/i.test(t)},
      {label:"Includes at least 70 words", ok:t.trim().split(/\s+/).filter(Boolean).length >= 70}
    ];
    const host = $("#summaryChecklist");
    host.innerHTML = checks.map(c => `<div class="checkitem ${c.ok ? "ok" : "no"}">${c.ok ? "✅" : "⚠️"} ${esc(c.label)}</div>`).join("");
    const good = checks.filter(c => c.ok).length;
    Score.award("summaryCheck:" + good, good);
  }

  function init(){
    Auto.load();
    setAuto(Auto.enabled);
    setVoice("en-US");
    updateScore();
    if(JS_STATUS) JS_STATUS.textContent = "JS: ✅ loaded";

    on("#btnStart", "click", () => $("#sec1").scrollIntoView({behavior:"smooth"}));
    on("#btnHow", "click", () => alert("How to use:\n1) Choose a Holland place and speak the 4 model sentences.\n2) Review vocabulary and weather words with flashcards.\n3) Practise past simple, past continuous and present perfect.\n4) Read the texts and answer questions.\n5) Compare model reviews by level.\n6) Do the dialogue and role plays.\n7) Build and check Eric’s trip summary.\n\nAudio starts only when you click a button unless Auto audio is ON."));
    on("#btnHeroListen", "click", () => Speech.say("Eric went to Holland. In this lesson, he will talk about what happened, describe the weather, explain what he visited, and write a clear review of his trip."));
    on("#voiceUS", "click", () => setVoice("en-US"));
    on("#voiceUK", "click", () => setVoice("en-GB"));
    on("#autoOff", "click", () => setAuto(false));
    on("#autoOn", "click", () => setAuto(true));
    on("#btnPause", "click", () => Speech.pause());
    on("#btnResume", "click", () => Speech.resume());
    on("#btnStop", "click", () => Speech.stop());
    on("#btnResetAll", "click", () => { if(confirm("Reset the whole lesson?")) location.reload(); });
    $$('[data-say]').forEach(btn => btn.addEventListener("click", () => Speech.say(btn.dataset.say)));

    renderPlaceFilters();
    renderPlaceGrid();
    on("#placeArea", "change", e => { placeState.area = e.target.value; placeState.place = null; renderPlaceGrid(); });
    on("#placeTheme", "change", e => { placeState.theme = e.target.value; placeState.place = null; renderPlaceGrid(); });
    on("#btnPlaceListen", "click", () => { if(placeState.place) Speech.say(placeState.place.lines.map(x => x[1]).join(" ")); });
    on("#btnPlaceHelp", "click", placeHelp);
    on("#btnPlaceDone", "click", () => {
      if(!placeState.place) return;
      Score.award("place:" + placeState.place.id, 2);
      const fb = $("#placeFb");
      fb.className = "feedback ok";
      fb.textContent = "✅ Great! Now try to say the same idea without reading.";
    });
    on("#btnPlaceReset", "click", () => $("#placeFb").classList.add("hidden"));

    renderVocabCats();
    renderVocab();
    on("#vocabSearch", "input", renderVocab);
    on("#vocabCat", "change", renderVocab);
    on("#btnVocabClear", "click", () => { $("#vocabSearch").value = ""; $("#vocabCat").value = "all"; renderVocab(); });
    on("#btnVocabSpeakAll", "click", () => Speech.say(visibleVocab().slice(0,12).map(v => `${v.w}. ${v.ex}`).join(" ")));

    renderGrammarQuiz();
    renderBuildSelect();
    renderBuilder();
    on("#buildSelect", "change", e => { buildState.idx = Number(e.target.value); renderBuilder(); });
    on("#btnBuildReset", "click", renderBuilder);
    on("#btnBuildCheck", "click", checkBuilder);
    on("#btnBuildSpeak", "click", () => Speech.say((BUILD_TASKS[buildState.idx] || BUILD_TASKS[0]).target));

    renderReadingSelect();
    renderReading();
    on("#readingSelect", "change", renderReading);
    on("#btnReadingListen", "click", () => {
      const idx = Number($("#readingSelect").value || 0);
      Speech.say((READINGS[idx] || READINGS[0]).text.join(" "));
    });
    on("#btnReadingFr", "click", () => $("#readingFr").classList.toggle("hidden"));

    renderModelSelects();
    renderModel();
    on("#modelSituation", "change", renderModel);
    on("#modelLevel", "change", renderModel);
    on("#btnModelListen", "click", () => Speech.say(currentModel().text));
    on("#btnModelCopy", "click", () => copyText(currentModel().text, "#modelFb"));

    renderRoleSelect();
    on("#roleSelect", "change", () => { roleState.current = ROLES[Number($("#roleSelect").value || 0)]; $("#roleTitle").textContent = roleState.current.title; $("#roleHelpBox").textContent = "Click Start."; $("#chatStream").innerHTML = ""; });
    on("#btnRoleStart", "click", startRole);
    on("#btnRoleNext", "click", nextRole);
    on("#btnRoleModel", "click", showRoleModel);
    on("#btnRolePhrases", "click", showRolePhrases);
    on("#btnRoleClear", "click", () => { $("#chatStream").innerHTML = ""; roleState.step = 0; $("#roleHelpBox").textContent = "Cleared. Click Start when ready."; });
    on("#btnPrepTimer", "click", () => runTimer("#prepTime", 15));
    on("#btnSpeakTimer", "click", () => runTimer("#speakTime", 45));

    on("#btnSummaryBuild", "click", buildSummary);
    on("#btnSummaryListen", "click", () => Speech.say($("#summaryText").value));
    on("#btnSummaryCopy", "click", () => copyText($("#summaryText").value, "#summaryChecklist"));
    on("#btnSummaryCheck", "click", checkSummary);
    buildSummary();
    checkSummary();
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
