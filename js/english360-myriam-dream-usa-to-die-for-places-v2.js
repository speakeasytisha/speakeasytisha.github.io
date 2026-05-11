(() => {
  'use strict';
  try{ window.__DreamUSALoaded = true; }catch(e){}

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const pad2 = n => String(n).padStart(2,'0');
  const fmt = s => `${pad2(Math.floor(s/60))}:${pad2(s%60)}`;
  const shuffle = arr => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const norm = s => (s||'').toLowerCase().replace(/[^\w\s’'-]/g,' ').replace(/\s+/g,' ').trim();
  const esc = s => (s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  const showErr = (msg) => {
    const box = $('#errBox');
    if(!box) return;
    box.hidden=false;
    box.textContent = '⚠️ ' + msg;
  };

  const toast = (msg) => {
    let t = $('#toast');
    if(!t){
      t = document.createElement('div');
      t.id = 'toast';
      Object.assign(t.style, {
        position:'fixed', left:'16px', bottom:'16px', padding:'10px 12px',
        background:'rgba(0,0,0,.72)', color:'#fff', borderRadius:'14px',
        border:'1px solid rgba(255,255,255,.14)', zIndex:9999, maxWidth:'80vw'
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display='block';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.style.display='none', 1700);
  };

  // TTS
  const tts = { voices:[], accent:'US', rate:1 };
  const loadVoices = () => {
    try{ tts.voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }catch(e){ tts.voices=[]; }
  };
  const pickVoice = () => {
    const v = tts.voices || [];
    if(!v.length) return null;
    const wants = tts.accent === 'UK' ? ['en-GB','United Kingdom','UK'] : ['en-US','United States','US'];
    return v.find(x => wants.some(w => (x.lang||'').includes(w) || (x.name||'').includes(w)))
      || v.find(x => (x.lang||'').startsWith('en'))
      || v[0];
  };
  const speak = (text) => {
    if(!('speechSynthesis' in window) || !text) return;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = tts.rate;
      const v = pickVoice();
      if(v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){}
  };

  // score
  const score = { ok:0, total:0 };
  const updateScoreUI = () => {
    $('#scorePill').textContent = `${score.ok} / ${score.total}`;
    $('#acc').textContent = score.total ? `${Math.round((score.ok/score.total)*100)}%` : '0%';
  };
  const addScore = (ok) => { score.total += 1; if(ok) score.ok += 1; updateScoreUI(); };
  const resetScore = () => { score.ok=0; score.total=0; updateScoreUI(); };

  const state = {
    level:'A2',
    showFR:true,   // vocabulary only
    placeId:'grand_canyon',
    currentClue:null,
    timers:{desc:null, speak:null, write:null}
  };

  // Type → adjectives (for compare)
  const typeMap = {
    natural: {adj:'natural', noun:'a natural place', reason:'I love wide-open landscapes.'},
    geothermal: {adj:'unique', noun:'a unique natural place', reason:'the colours look magical.'},
    iconic: {adj:'iconic', noun:'an iconic place', reason:'it feels like a movie scene.'},
    cultural: {adj:'cultural', noun:'a cultural place', reason:'I like history, architecture, and atmosphere.'},
    tropical: {adj:'tropical', noun:'a tropical place', reason:'it looks peaceful and refreshing.'},
    dramatic: {adj:'dramatic', noun:'a dramatic landscape', reason:'the view looks breathtaking.'},
  };

  const places = [
    {
      id:'grand_canyon',
      type:'natural',
      name:'Grand Canyon (Arizona)',
      meta:'National Park • Desert canyon • Viewpoints',
      tag:'nature / wow',
      img:'https://upload.wikimedia.org/wikipedia/commons/8/85/Grand_Canyon_Panorama_2013.jpg',
      credit:'Wikimedia Commons — Grand Canyon Panorama 2013 (CC)',
      creditUrl:'https://commons.wikimedia.org/wiki/File:Grand_Canyon_Panorama_2013.jpg',
      prompt:'Describe this canyon: colours, depth, cliffs, horizon. Give your opinion: impressive? peaceful?',
      tokens:['canyon','cliff','rocks','layers','viewpoint','ridge','deep','wide','shadow','desert'],
      vocab:[
        {cat:'Landscape', en:'a canyon', fr:'un canyon', ex:'The canyon is deep and wide.'},
        {cat:'Landscape', en:'a cliff', fr:'une falaise', ex:'The cliffs look steep.'},
        {cat:'Landscape', en:'rock layers', fr:'couches de roche', ex:'You can see rock layers.'},
        {cat:'Adjectives', en:'breathtaking', fr:'à couper le souffle', ex:'It is breathtaking.'},
        {cat:'Adjectives', en:'steep', fr:'abrupt', ex:'The cliff is steep.'},
        {cat:'Adjectives', en:'vast', fr:'immense', ex:'The landscape is vast.'},
        {cat:'Opinion', en:'I’m amazed', fr:'je suis impressionné(e)', ex:'I’m amazed by the view.'},
        {cat:'Opinion', en:'It looks unreal', fr:'ça paraît irréel', ex:'It looks unreal.'},
      ],
      clues:[
        {q:'I spy something very deep.', answers:['canyon'], model:'I can see a canyon in the middle of the image. It looks very deep.'},
        {q:'I spy a steep edge.', answers:['cliff','edge'], model:'I can see a steep cliff on the side. It looks very high.'},
        {q:'I spy many colours in the rocks.', answers:['layers','rocks'], model:'I can see rock layers. They are red and orange.'},
      ],
      models:{
        A2:"This picture shows the Grand Canyon. In the middle, I can see a very deep canyon with rocks and cliffs. The colours are red and orange. In the background, I can see the horizon. Overall, it looks breathtaking.",
        B1:"This picture shows the Grand Canyon in Arizona. In the foreground and the middle, there are steep cliffs and deep valleys, with many red and orange rock layers. In the background, the horizon looks very far away, so the landscape feels vast. In my opinion, it looks breathtaking and impressive.",
        B2:"The image depicts the Grand Canyon, with dramatic cliffs and layered rock formations stretching toward the horizon. Deep valleys and ridges create strong shadows, while the red and orange tones make the landscape look almost unreal. Overall, the place seems vast and powerful, and I would love to visit because it looks breathtaking."
      }
    },
    {
      id:'yellowstone',
      type:'geothermal',
      name:'Yellowstone (Grand Prismatic Spring)',
      meta:'National Park • Geothermal • Steam + colours',
      tag:'nature / colours',
      img:'https://upload.wikimedia.org/wikipedia/commons/3/3f/Grand_Prismatic_Spring_Overlook_%2827702569359%29.jpg',
      credit:'Wikimedia Commons — Grand Prismatic Spring Overlook (CC)',
      creditUrl:'https://commons.wikimedia.org/wiki/File:Grand_Prismatic_Spring_Overlook_(27702569359).jpg',
      prompt:'Describe the colours, the steam, the shape, and the landscape around it. What do you think of this place?',
      tokens:['hot spring','steam','turquoise','orange','mineral','forest'],
      vocab:[
        {cat:'Landscape', en:'a hot spring', fr:'une source chaude', ex:'This hot spring is famous.'},
        {cat:'Landscape', en:'steam', fr:'de la vapeur', ex:'Steam rises from the water.'},
        {cat:'Landscape', en:'mineral deposits', fr:'dépôts minéraux', ex:'Mineral deposits create colours.'},
        {cat:'Colours', en:'turquoise', fr:'turquoise', ex:'The water looks turquoise.'},
        {cat:'Colours', en:'bright orange', fr:'orange vif', ex:'The edge is bright orange.'},
        {cat:'Opinion', en:'It looks magical', fr:'ça a l’air magique', ex:'It looks magical to me.'},
        {cat:'Opinion', en:'I would be curious', fr:'je serais curieux/curieuse', ex:'I would be curious to see it.'},
      ],
      clues:[
        {q:'I spy something that produces steam.', answers:['hot spring','spring'], model:'I can see a hot spring. Steam rises from the water.'},
        {q:'I spy a bright colour at the edge.', answers:['orange'], model:'I can see bright orange colours at the edge of the spring.'},
        {q:'I spy a natural place around it.', answers:['forest','trees'], model:'I can see a forest in the background.'},
      ],
      models:{
        A2:"This picture shows a hot spring. The water is blue and green. There is steam. The colours are very bright. In the background, I can see trees. It looks amazing.",
        B1:"This picture shows the Grand Prismatic Spring in Yellowstone. In the middle, the water looks turquoise, and there is steam rising. Around the water, I can see bright orange and yellow colours. In the background, there is a forest. In my opinion, it looks magical and impressive.",
        B2:"The image shows a geothermal hot spring with intense colours. The turquoise centre contrasts with orange and yellow mineral bands, while steam rises and creates a mysterious atmosphere. In the background, the forest makes the scene feel wild and natural. Overall, the place seems extraordinary."
      }
    },
    {
      id:'golden_gate',
      type:'iconic',
      name:'Golden Gate Bridge (San Francisco)',
      meta:'Iconic bridge • Fog • Bay',
      tag:'city / iconic',
      img:'https://upload.wikimedia.org/wikipedia/commons/f/f3/Sea_of_Fog%2C_San_Francisco.jpg',
      credit:'Wikimedia Commons — Sea of Fog, San Francisco (CC)',
      creditUrl:'https://commons.wikimedia.org/wiki/File:Sea_of_Fog,_San_Francisco.jpg',
      prompt:'Describe the bridge, the fog, the bay, and the atmosphere. What adjective fits best?',
      tokens:['bridge','tower','cables','fog','bay','skyline','water'],
      vocab:[
        {cat:'Monument', en:'a bridge', fr:'un pont', ex:'The bridge is huge.'},
        {cat:'Monument', en:'a tower', fr:'une tour', ex:'The tower is tall.'},
        {cat:'Weather', en:'fog', fr:'du brouillard', ex:'Fog covers the bridge.'},
        {cat:'Adjectives', en:'iconic', fr:'emblématique', ex:'It is an iconic place.'},
        {cat:'Adjectives', en:'mysterious', fr:'mystérieux', ex:'The scene looks mysterious.'},
        {cat:'Opinion', en:'It looks cinematic', fr:'ça fait “film”', ex:'It looks cinematic.'},
      ],
      clues:[
        {q:'I spy weather that hides things.', answers:['fog'], model:'I can see fog. It hides part of the bridge.'},
        {q:'I spy a big structure with cables.', answers:['bridge','cables'], model:'I can see a suspension bridge with cables.'},
        {q:'I spy water under the bridge.', answers:['bay','water'], model:'I can see water under the bridge. It looks calm.'},
      ],
      models:{
        A2:"This picture shows a bridge. There is a lot of fog. In the background, I can see a city. The bridge looks very big. It looks beautiful.",
        B1:"This picture shows the Golden Gate Bridge in San Francisco. The bridge crosses the bay, and fog covers part of it. In the background, I can see the city skyline. The atmosphere is calm and a little mysterious.",
        B2:"The image captures the Golden Gate Bridge emerging above a sea of fog. The red towers and cables contrast with the white mist, while the skyline appears in the background. Overall, the scene feels cinematic and slightly mysterious."
      }
    },
    {
      id:'new_orleans',
      type:'cultural',
      name:'New Orleans — French Quarter (Jackson Square)',
      meta:'Historic district • Architecture • Atmosphere',
      tag:'city / culture',
      img:'https://upload.wikimedia.org/wikipedia/commons/7/72/Jackson_Square_New_Orleans.jpg',
      credit:'Wikimedia Commons — Jackson Square New Orleans (CC)',
      creditUrl:'https://commons.wikimedia.org/wiki/File:Jackson_Square_New_Orleans.jpg',
      prompt:'Describe the architecture, the square, and the atmosphere (lively/charming). Imagine music and restaurants.',
      tokens:['square','cathedral','statue','historic','lively','charming'],
      vocab:[
        {cat:'City', en:'a square', fr:'une place', ex:'The square is lively.'},
        {cat:'City', en:'a cathedral', fr:'une cathédrale', ex:'The cathedral is impressive.'},
        {cat:'City', en:'a statue', fr:'une statue', ex:'There is a statue in the square.'},
        {cat:'Adjectives', en:'historic', fr:'historique', ex:'It is a historic district.'},
        {cat:'Adjectives', en:'charming', fr:'charmant', ex:'The place looks charming.'},
        {cat:'Atmosphere', en:'lively', fr:'animé', ex:'The area is lively.'},
      ],
      clues:[
        {q:'I spy a religious building.', answers:['cathedral'], model:'I can see a cathedral in the background. It looks historic.'},
        {q:'I spy a monument in the centre.', answers:['statue'], model:'I can see a statue in the square. It is in the centre.'},
        {q:'I spy a place where people can meet.', answers:['square'], model:'I can see a square. People can meet there.'},
      ],
      models:{
        A2:"This picture shows a square in a city. I can see a cathedral and a statue. The place looks nice and historic. I think it is lively.",
        B1:"This picture shows Jackson Square in New Orleans. There is a statue in the square, and a cathedral in the background. The buildings look historic. In my opinion, the place looks charming and lively.",
        B2:"The image depicts a historic square in New Orleans, with a cathedral rising in the background and a statue in the foreground. The light and sky create a beautiful atmosphere. Overall, the place seems lively and charming, and it suggests culture and history."
      }
    },
    {
      id:'road_to_hana',
      type:'tropical',
      name:'Road to Hāna (Maui, Hawaii)',
      meta:'Tropical • Waterfall • Lush greenery',
      tag:'nature / tropical',
      img:'https://upload.wikimedia.org/wikipedia/commons/c/c5/Small_waterfall_on_the_road_to_Hana_%288017236735%29.jpg',
      credit:'Wikimedia Commons — Small waterfall on the road to Hana (CC)',
      creditUrl:'https://commons.wikimedia.org/wiki/File:Small_waterfall_on_the_road_to_Hana_(8017236735).jpg',
      prompt:'Describe the waterfall, the vegetation, and the water. Does it look relaxing or adventurous?',
      tokens:['waterfall','pool','lush','tropical','moss','green'],
      vocab:[
        {cat:'Landscape', en:'a waterfall', fr:'une cascade', ex:'A waterfall falls into a pool.'},
        {cat:'Landscape', en:'a pool', fr:'un bassin', ex:'The pool looks calm.'},
        {cat:'Nature', en:'lush', fr:'luxuriant', ex:'The forest is lush.'},
        {cat:'Nature', en:'tropical', fr:'tropical', ex:'It looks tropical.'},
        {cat:'Adjectives', en:'peaceful', fr:'paisible', ex:'The place looks peaceful.'},
        {cat:'Opinion', en:'I would love to swim there', fr:'j’aimerais nager là‑bas', ex:'I would love to swim there.'},
      ],
      clues:[
        {q:'I spy moving water.', answers:['waterfall'], model:'I can see a waterfall. The water is falling into a pool.'},
        {q:'I spy a very green environment.', answers:['green','lush','plants'], model:'I can see lush green plants around the waterfall.'},
        {q:'I spy a calm body of water.', answers:['pool'], model:'I can see a pool at the bottom. It looks calm.'},
      ],
      models:{
        A2:"This picture shows a waterfall. The water falls into a pool. There are many green plants. It looks peaceful. I would like to go there.",
        B1:"This picture shows a small waterfall on the Road to Hana in Maui. The waterfall falls into a calm pool, and everything looks very green and tropical. In my opinion, it looks peaceful and refreshing.",
        B2:"The image shows a tropical waterfall flowing into a quiet pool, surrounded by lush green vegetation. The rocks look wet and covered with moss, which suggests a fresh environment. Overall, the place seems peaceful and inviting."
      }
    },
    {
      id:'monument_valley',
      type:'dramatic',
      name:'Monument Valley (Arizona/Utah)',
      meta:'Desert • Red rock buttes • Sunset light',
      tag:'nature / dramatic',
      img:'https://upload.wikimedia.org/wikipedia/commons/5/57/Monument_Valley_Sunset_MC.jpg',
      credit:'Wikimedia Commons — Monument Valley Sunset (CC)',
      creditUrl:'https://commons.wikimedia.org/wiki/File:Monument_Valley_Sunset_MC.jpg',
      prompt:'Describe the rock formations, the light, the colours, and the desert. Does it look cinematic?',
      tokens:['desert','butte','red rock','sunset','vast','horizon'],
      vocab:[
        {cat:'Landscape', en:'the desert', fr:'le désert', ex:'The desert looks dry.'},
        {cat:'Landscape', en:'a butte', fr:'une butte rocheuse', ex:'The buttes are iconic.'},
        {cat:'Colours', en:'golden light', fr:'lumière dorée', ex:'The golden light is beautiful.'},
        {cat:'Adjectives', en:'dramatic', fr:'spectaculaire', ex:'The view is dramatic.'},
        {cat:'Adjectives', en:'vast', fr:'immense', ex:'The landscape is vast.'},
        {cat:'Opinion', en:'It looks like a movie', fr:'on dirait un film', ex:'It looks like a movie scene.'},
      ],
      clues:[
        {q:'I spy a very dry landscape.', answers:['desert'], model:'I can see the desert. It looks dry and vast.'},
        {q:'I spy a tall rock formation.', answers:['butte','rock'], model:'I can see a tall butte. It looks dramatic.'},
        {q:'I spy warm light.', answers:['sunset','golden'], model:'I can see golden sunset light on the rocks.'},
      ],
      models:{
        A2:"This picture shows a desert. I can see big rocks and a blue sky. The rocks are red. It looks very beautiful. I think it is quiet.",
        B1:"This picture shows Monument Valley at sunset. I can see huge red rock buttes. The landscape looks vast and dry. The light is warm and golden. In my opinion, it looks dramatic and cinematic.",
        B2:"The image depicts Monument Valley bathed in warm sunset light. Massive sandstone buttes rise from the desert floor, creating strong silhouettes and long shadows. Overall, the landscape feels vast, quiet, and dramatic."
      }
    }
  ];

  const starterLines = [
    'First, I can see…',
    'In the foreground…',
    'In the background…',
    'It looks…',
    'I think… because…',
    'Overall,…',
    'Maybe / It might be…'
  ];

  const ladder = {
    A2:`1) What is it?\n→ This is… / There is… / There are…\n\n2) Where is it?\n→ on the left / in the middle / next to / behind…\n\n3) What does it look like?\n→ 2–3 adjectives\n\n4) What is happening?\n→ He is… / They are…\n\n5) Opinion\n→ I think… because…`,
    B1:`1) Main elements + location\n2) Add details + adjectives\n3) Add one connector (also / in addition)\n4) Add meaning (maybe / it seems)\n5) Finish with an opinion`,
    B2:`1) Foreground → middle → background\n2) Rich adjectives + precise nouns\n3) Speculation: might / seems / suggests\n4) Contrast: although / whereas\n5) Develop: reason + example`
  };

  const frames = [
    {en:'This picture shows…', fr:'Cette image montre…'},
    {en:'In the foreground, I can see…', fr:'Au premier plan, je peux voir…'},
    {en:'In the middle, there is…', fr:'Au milieu, il y a…'},
    {en:'In the background, there are…', fr:'À l’arrière-plan, il y a…'},
    {en:'It looks (peaceful / dramatic / lively)…', fr:'Ça a l’air (paisible / spectaculaire / animé)…'},
    {en:'The atmosphere seems…', fr:'L’ambiance semble…'},
    {en:'Maybe it is… / It might be…', fr:'Peut‑être que c’est… / Ça pourrait être…'},
    {en:'Overall, I would love to visit because…', fr:'Globalement, j’aimerais visiter parce que…'},
    {en:'Compared to…, this place is more…', fr:'Comparé à…, cet endroit est plus…'},
  ];

  const cmpConnectors = ['Both places…','However,…','Compared to…,','Whereas…','On the one hand…','On the other hand…','Overall,…'];

  const fluency = [
    {en:'Let me think…', fr:'Alors…'},
    {en:'For example,…', fr:'Par exemple,…'},
    {en:'To be honest,…', fr:'Honnêtement,…'},
    {en:'In my opinion,…', fr:'À mon avis,…'},
    {en:'What I like is…', fr:'Ce que j’aime, c’est…'},
    {en:'It seems that…', fr:'On dirait que…'},
  ];

  const writingPhrases = [
    {en:'I would love to visit… because…', fr:'J’aimerais visiter… parce que…'},
    {en:'The place looks… and it seems…', fr:'L’endroit a l’air… et il semble…'},
    {en:'First,… Then,… Finally,…', fr:'D’abord… Ensuite… Enfin…'},
    {en:'Overall, I think it would be…', fr:'Globalement, je pense que ce serait…'},
    {en:'Compared to…, I prefer…', fr:'Comparé à…, je préfère…'},
    {en:'It looks like a dream trip!', fr:'Ça a l’air d’un voyage de rêve !'},
  ];

  const prompts = {
    speaking: (p) => `Speaking prompt:\n\nChoose ONE place and “sell it” in 60–90 seconds.\n1) What can you see?\n2) Why is it special?\n3) What would you do there?\n4) Your opinion + because\n\nPlace: ${p.name}`,
    writing: (p) => `Writing prompt:\n\nWrite 8–10 lines about ONE dream place in the USA.\nUse: description + opinion + 1 comparison.\n\nPlace: ${p.name}\n\nTip: First… Then… Finally… Overall…`
  };

  // helpers
  const placeById = (id) => places.find(p => p.id === id) || places[0];
  const wordCount = (text) => (text || '').trim().split(/\s+/).filter(Boolean).length;

  const stopTimer = (key, outId) => {
    if(state.timers[key]) clearInterval(state.timers[key]);
    state.timers[key] = null;
    if(outId) $('#' + outId).textContent = '00:00';
  };
  const startTimer = (key, seconds, outId, doneMsg) => {
    stopTimer(key);
    let left = seconds;
    $('#' + outId).textContent = fmt(left);
    state.timers[key] = setInterval(() => {
      left -= 1;
      $('#' + outId).textContent = fmt(Math.max(0,left));
      if(left <= 0){
        clearInterval(state.timers[key]);
        state.timers[key] = null;
        toast(doneMsg);
      }
    }, 1000);
  };

  // chips rendering
  const renderStarterChips = () => {
    const host = $('#starterChips');
    host.innerHTML = '';
    starterLines.forEach(line => {
      const b = document.createElement('button');
      b.type='button'; b.className='chip';
      b.textContent = line;
      b.addEventListener('click', () => {
        const box = $('#descBox');
        box.value = (box.value ? box.value + '\n' : '') + line;
        $('#descWords').textContent = String(wordCount(box.value));
        speak(line.replace('…',''));
      });
      host.appendChild(b);
    });
  };

  const renderFramesChips = () => {
    const host = $('#framesChips');
    host.innerHTML='';
    frames.forEach(x => {
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = state.showFR ? `${esc(x.en)}<span class="sub">${esc(x.fr)}</span>` : `${esc(x.en)}`;
      b.addEventListener('click', () => {
        const ta=$('#framesBox');
        ta.value = (ta.value ? ta.value + '\n' : '') + x.en;
        speak(x.en.replace('…',''));
      });
      host.appendChild(b);
    });
  };

  const renderCmpChips = () => {
    const host = $('#cmpChips');
    host.innerHTML='';
    cmpConnectors.forEach(line => {
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.textContent=line;
      b.addEventListener('click', () => {
        const ta=$('#cmpBox');
        ta.value = (ta.value ? ta.value + ' ' : '') + line + ' ';
        speak(line.replace('…',''));
      });
      host.appendChild(b);
    });
  };

  const renderFluencyChips = () => {
    const host = $('#fluencyChips');
    host.innerHTML='';
    fluency.forEach(x => {
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = state.showFR ? `${esc(x.en)}<span class="sub">${esc(x.fr)}</span>` : `${esc(x.en)}`;
      b.addEventListener('click', () => {
        const ta=$('#sNotes');
        ta.value = (ta.value ? ta.value + '\n' : '') + x.en;
        speak(x.en.replace('…',''));
      });
      host.appendChild(b);
    });
  };

  const renderWritingChips = () => {
    const host = $('#wChips');
    host.innerHTML='';
    writingPhrases.forEach(x => {
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = state.showFR ? `${esc(x.en)}<span class="sub">${esc(x.fr)}</span>` : `${esc(x.en)}`;
      b.addEventListener('click', () => {
        const ta=$('#wBox');
        ta.value = (ta.value ? ta.value + '\n' : '') + x.en;
        $('#wWords').textContent = String(wordCount(ta.value));
        speak(x.en.replace('…',''));
      });
      host.appendChild(b);
    });
  };

  // vocabulary data
  let vocabAll = [];
  let vocabCats = [];

  const buildVocabList = () => {
    const p = placeById(state.placeId);
    const base = [
      {cat:'Location', en:'on the left', fr:'à gauche', ex:'On the left, I can see…'},
      {cat:'Location', en:'in the middle', fr:'au milieu', ex:'In the middle, there is…'},
      {cat:'Location', en:'in the background', fr:'à l’arrière-plan', ex:'In the background, there are…'},
      {cat:'Connectors', en:'in addition', fr:'en plus', ex:'In addition, …'},
      {cat:'Connectors', en:'however', fr:'cependant', ex:'However, …'},
      {cat:'Speculation', en:'it seems', fr:'on dirait', ex:'It seems calm.'},
      {cat:'Speculation', en:'maybe', fr:'peut-être', ex:'Maybe it is…'},
    ];
    vocabAll = base.concat(p.vocab || []);
    vocabCats = ['All'].concat(Array.from(new Set(vocabAll.map(x => x.cat))).sort());
  };

  const rebuildVocabCategorySelect = () => {
    const sel = $('#vCat');
    const prev = sel.value || 'All';
    sel.innerHTML = vocabCats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
    sel.value = vocabCats.includes(prev) ? prev : 'All';
  };

  const renderVocab = () => {
    const sel = $('#vCat');
    const q = ($('#vSearch').value || '').trim().toLowerCase();
    const cat = sel.value || 'All';

    let filtered = vocabAll.filter(x =>
      (cat === 'All' || x.cat === cat) &&
      (!q || x.en.toLowerCase().includes(q) || (x.fr||'').toLowerCase().includes(q))
    );

    if(cat === 'All'){
      filtered.sort((a,b) => (a.cat.localeCompare(b.cat) || a.en.localeCompare(b.en)));
    }else{
      filtered.sort((a,b) => a.en.localeCompare(b.en));
    }

    const host = $('#vChips');
    host.innerHTML='';
    filtered.forEach(x => {
      const b=document.createElement('button');
      b.type='button'; b.className='chip';
      b.innerHTML = state.showFR ? `${esc(x.en)}<span class="sub">${esc(x.fr||'')}</span>` : `${esc(x.en)}`;
      b.addEventListener('click', () => speak(x.en));
      host.appendChild(b);
    });

    const listHost = $('#vList');
    listHost.innerHTML = filtered.map(x => `
      <div class="panel" style="margin-bottom:10px;">
        <div class="miniTitle">${esc(x.cat)}</div>
        <div style="font-weight:950;">${esc(x.en)} ${state.showFR ? `<span class="muted">— ${esc(x.fr||'')}</span>` : ''}</div>
        <div class="tiny muted mt6"><strong>Example:</strong> ${esc(x.ex || '')}</div>
      </div>
    `).join('') || `<div class="tiny muted">No results.</div>`;
  };

  // place rendering
  const fillPlaceSelects = () => {
    const opts = places.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('');
    $('#placeSelect').innerHTML = opts;
    $('#cmpA').innerHTML = opts;
    $('#cmpB').innerHTML = opts;
    $('#placeSelect').value = state.placeId;
    $('#cmpA').value = places[0].id;
    $('#cmpB').value = places[2].id;
  };

  const renderTokens = () => {
    const p = placeById(state.placeId);
    const host = $('#tokensChips');
    host.innerHTML='';
    p.tokens.forEach(t => {
      const b=document.createElement('button');
      b.type='button';
      b.className='tok';
      b.textContent = t;
      b.addEventListener('click', () => speak(t));
      host.appendChild(b);
    });
  };

  const newClue = () => {
    const p = placeById(state.placeId);
    const clue = shuffle(p.clues)[0];
    state.currentClue = clue;
    $('#ispyPrompt').textContent = clue.q;
  };

  const renderPrompts = () => {
    const p = placeById(state.placeId);
    $('#speakPrompt').textContent = prompts.speaking(p);
    $('#wPrompt').textContent = prompts.writing(p);
    $('#sChecklist').textContent = [
      '• 1 location phrase (foreground/background)',
      '• 2 adjectives',
      '• 1 speculation (maybe / it seems / might)',
      '• 1 opinion + because',
      '• 1 comparison (optional)'
    ].join('\n');
    $('#sModelOut').textContent = '';
    $('#wModelOut').textContent = '';
  };

  const renderPlace = () => {
    const p = placeById(state.placeId);

    $('#placeName').textContent = p.name;
    $('#placeMeta').textContent = p.meta;
    $('#placeTag').textContent = p.tag;

    const img = $('#placeImg');
    img.src = p.img;
    img.alt = `Photo: ${p.name}`;

    const credit = $('#imgCredit');
    credit.innerHTML = `Image (CC): <a href="${p.creditUrl}" target="_blank" rel="noopener noreferrer">${esc(p.credit)}</a>`;

    $('#placePrompt').textContent = p.prompt;

    $('#modelOut').textContent = '';
    $('#descFeedback').textContent = '';
    $('#ispyFeedback').textContent = '';
    $('#ispyBox').value = '';
    $('#descBox').value = '';
    $('#descWords').textContent = '0';

    renderTokens();
    newClue();

    buildVocabList();
    rebuildVocabCategorySelect();
    renderVocab();

    renderPrompts();
  };

  const setLevel = (lvl) => {
    state.level = lvl;
    $$('.segBtn[data-level]').forEach(b => b.classList.toggle('on', b.dataset.level === lvl));
    $('#ladderBox').textContent = ladder[lvl] || ladder.A2;
  };

  const setFR = (on) => {
    state.showFR = !!on;
    $('#frToggle').textContent = state.showFR ? 'On' : 'Off';
    $('#frToggle').setAttribute('aria-pressed', state.showFR ? 'true' : 'false');
    renderVocab();
    renderFramesChips();
    renderFluencyChips();
    renderWritingChips();
  };

  const setAccent = (acc) => {
    tts.accent = acc;
    $$('.segBtn[data-accent]').forEach(b => b.classList.toggle('on', b.dataset.accent === acc));
  };

  // checks
  const quickCheck = () => {
    const p = placeById(state.placeId);
    const txt = $('#descBox').value || '';
    const n = norm(txt);

    const hasLocation = /(on the left|on the right|in the (middle|centre|center)|in the foreground|in the background|next to|behind|in front of)/.test(n);
    const hasOpinion = /(i think|in my opinion|overall|i would|it looks|it seems|maybe|might)/.test(n);
    const hasAdj = /(beautiful|breathtaking|dramatic|peaceful|lively|charming|vast|steep|iconic|tropical|lush|amazing|mysterious|cinematic|unique)/.test(n);
    const hasToken = p.tokens.some(t => n.includes(norm(t)));

    const checks = [
      {k:'Location phrase', ok:hasLocation},
      {k:'Adjective', ok:hasAdj},
      {k:'Opinion / maybe', ok:hasOpinion},
      {k:'Word from the image', ok:hasToken},
      {k:'Min 35 words', ok:wordCount(txt) >= 35}
    ];

    const okCount = checks.filter(x=>x.ok).length;
    addScore(okCount >= 3);

    $('#descFeedback').textContent = [
      `Points: ${okCount}/5`,
      ...checks.map(c => `${c.ok ? '✅' : '⬜'} ${c.k}`),
      '',
      'Upgrade tip:',
      (state.level === 'A2') ? 'Add 1 connector: “In addition, …”' :
      (state.level === 'B1') ? 'Add “maybe / it seems / suggests” + one reason.' :
      'Add contrast: “Although…, …”'
    ].join('\n');
  };

  const showModel = () => {
    const p = placeById(state.placeId);
    $('#modelOut').textContent = (p.models && p.models[state.level]) ? p.models[state.level] : '';
  };

  // I spy
  const checkIspy = () => {
    const clue = state.currentClue;
    const txt = norm($('#ispyBox').value);
    if(!txt){
      $('#ispyFeedback').textContent = 'Write a full sentence.';
      return;
    }
    const hasStructure = txt.includes('i can see') || txt.includes('there is') || txt.includes('there are');
    const hasAnswer = clue.answers.some(a => txt.includes(norm(a)));
    const ok = hasStructure && hasAnswer;
    addScore(ok);
    $('#ispyFeedback').textContent = ok
      ? '✅ Great! Full sentence + correct item.'
      : `❌ Not yet.\nTip: start with “I can see…”.\nModel: ${clue.model}`;
  };

  // Compare
  const placeDesc = (p) => typeMap[p.type] || {adj:'interesting', noun:'an interesting place', reason:'it looks great.'};

  const buildComparison = () => {
    const a = placeById($('#cmpA').value);
    const b = placeById($('#cmpB').value);
    const da = placeDesc(a);
    const db = placeDesc(b);

    const line1 = (state.level === 'A2')
      ? `Both places are amazing, but ${a.name} looks more like ${da.noun}.`
      : `Both places are amazing, but ${a.name} looks more ${da.adj}.`;

    const line2 = (state.level === 'A2')
      ? `However, ${b.name} feels more like ${db.noun}.`
      : `However, ${b.name} feels more ${db.adj}.`;

    const line3 = `Compared to ${b.name}, I would rather visit ${a.name} because ${da.reason}`;

    $('#cmpBox').value = [line1, line2, line3].join(' ');
    $('#cmpFeedback').textContent = '';
  };

  const checkComparison = () => {
    const t = norm($('#cmpBox').value);
    const hasCompared = t.includes('compared to') || t.includes('whereas');
    const hasOpinion = t.includes('i would rather') || t.includes('i would prefer') || t.includes('i prefer');
    const hasBecause = t.includes('because');
    const ok = hasCompared && hasOpinion && hasBecause;
    addScore(ok);
    $('#cmpFeedback').textContent = ok
      ? '✅ Great comparison: contrast + preference + reason.'
      : '❌ Add: “Compared to …” + “I would rather … because …”.';
  };

  // Speaking + Writing models
  const showSpeakingModel = () => {
    const p = placeById(state.placeId);
    const base = p.models[state.level] || '';
    const extra = (state.level === 'A2')
      ? 'I would like to visit because it looks beautiful.'
      : (state.level === 'B1')
        ? 'I would love to visit because it looks unique and memorable.'
        : 'I would absolutely love to visit because it seems like a once‑in‑a‑lifetime experience.';
    $('#sModelOut').textContent = base + "\n\n" + extra;
  };

  const showWritingModel = () => {
    const p = placeById(state.placeId);
    const a2 = `I would love to visit ${p.name}. ${p.models.A2}\nOverall, it looks like a dream trip!`;
    const b1 = `I would love to visit ${p.name}.\n${p.models.B1}\nCompared to other places, it feels special.\nOverall, I think it would be an unforgettable trip.`;
    const b2 = `I would love to visit ${p.name}.\n${p.models.B2}\nCompared to other destinations, it stands out because it has a strong atmosphere.\nOverall, it seems like a once‑in‑a‑lifetime experience.`;
    $('#wModelOut').textContent = (state.level==='A2') ? a2 : (state.level==='B1') ? b1 : b2;
  };

  const copyText = async (txt) => {
    try{ await navigator.clipboard.writeText(txt); toast('✅ Copied.'); }
    catch(e){ toast('Copy blocked.'); }
  };

  const resetAll = () => {
    stopTimer('desc','descTimer');
    stopTimer('speak','sTimer');
    stopTimer('write','wTimer');
    $('#descBox').value=''; $('#descWords').textContent='0';
    $('#framesBox').value='';
    $('#cmpBox').value=''; $('#cmpFeedback').textContent='';
    $('#ispyBox').value=''; $('#ispyFeedback').textContent='';
    $('#sNotes').value=''; $('#sModelOut').textContent='';
    $('#wBox').value=''; $('#wWords').textContent='0'; $('#wModelOut').textContent='';
    $('#modelOut').textContent=''; $('#descFeedback').textContent='';
    toast('Reset done.');
  };

  const newSet = () => {
    const ids = places.map(p => p.id);
    state.placeId = ids[Math.floor(Math.random()*ids.length)];
    $('#placeSelect').value = state.placeId;
    renderPlace();
    toast('✨ New place loaded.');
  };

  const init = () => {
    $('#jsOk').textContent = 'JS: ready ✅';
    loadVoices();
    if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

    fillPlaceSelects();
    updateScoreUI();

    renderStarterChips();
    renderFramesChips();
    renderCmpChips();
    renderFluencyChips();
    renderWritingChips();

    setLevel('A2');
    setFR(true);
    setAccent('US');

    renderPlace();

    // listeners
    $$('.segBtn[data-level]').forEach(b => b.addEventListener('click', () => { setLevel(b.dataset.level); }));
    $$('.segBtn[data-accent]').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));

    $('#frToggle').addEventListener('click', () => setFR(!state.showFR));
    $('#rate').addEventListener('input', (e) => { tts.rate = parseFloat(e.target.value || '1'); });

    $('#printBtn').addEventListener('click', () => window.print());
    $('#newSetBtn').addEventListener('click', newSet);
    $('#resetAllBtn').addEventListener('click', resetAll);
    $('#resetScore').addEventListener('click', resetScore);

    $('#placeSelect').addEventListener('change', (e) => { state.placeId = e.target.value; renderPlace(); });
    $('#shufflePlaceBtn').addEventListener('click', newSet);
    $('#sayPlacePromptBtn').addEventListener('click', () => speak($('#placePrompt').textContent));

    $('#descBox').addEventListener('input', () => { $('#descWords').textContent = String(wordCount($('#descBox').value)); });
    $('#d60Btn').addEventListener('click', () => startTimer('desc', 60, 'descTimer', 'Time! Finish with one opinion.'));
    $('#dStopBtn').addEventListener('click', () => stopTimer('desc', 'descTimer'));
    $('#sayDescBtn').addEventListener('click', () => speak($('#descBox').value));
    $('#clearDescBtn').addEventListener('click', () => { $('#descBox').value=''; $('#descWords').textContent='0'; });
    $('#quickCheckBtn').addEventListener('click', quickCheck);

    $('#showModelBtn').addEventListener('click', showModel);
    $('#modelA2Btn').addEventListener('click', () => { setLevel('A2'); showModel(); });
    $('#modelB1Btn').addEventListener('click', () => { setLevel('B1'); showModel(); });
    $('#modelB2Btn').addEventListener('click', () => { setLevel('B2'); showModel(); });
    $('#sayModelBtn').addEventListener('click', () => speak($('#modelOut').textContent));

    // vocab
    $('#vSearch').addEventListener('input', renderVocab);
    $('#vCat').addEventListener('change', renderVocab);
    $('#vShuffleBtn').addEventListener('click', () => { $('#vSearch').value=''; renderVocab(); toast('Vocabulary refreshed.'); });
    $('#vToDescBtn').addEventListener('click', () => {
      const chips = $$('#vChips .chip').slice(0,3).map(b => b.textContent.trim());
      const box = $('#descBox');
      if(chips.length){
        box.value = (box.value ? box.value + '\n' : '') + 'Vocabulary: ' + chips.join(', ');
        $('#descWords').textContent = String(wordCount(box.value));
        toast('Added 3 words.');
      }
    });

    // frames
    $('#framesClearBtn').addEventListener('click', () => { $('#framesBox').value=''; });
    $('#framesSayBtn').addEventListener('click', () => speak($('#framesBox').value));
    $('#framesToDescBtn').addEventListener('click', () => {
      const b = $('#framesBox').value.trim();
      if(!b) return;
      const box = $('#descBox');
      box.value = (box.value ? box.value + '\n\n' : '') + b;
      $('#descWords').textContent = String(wordCount(box.value));
      toast('Sent to description.');
    });

    $('#copyLadderBtn').addEventListener('click', () => copyText($('#ladderBox').textContent));
    $('#sayLadderBtn').addEventListener('click', () => speak($('#ladderBox').textContent));

    // ispy
    $('#newIspyBtn').addEventListener('click', () => { newClue(); $('#ispyFeedback').textContent=''; $('#ispyBox').value=''; });
    $('#sayIspyBtn').addEventListener('click', () => speak($('#ispyPrompt').textContent));
    $('#ispyCheckBtn').addEventListener('click', checkIspy);
    $('#ispyShowBtn').addEventListener('click', () => { if(state.currentClue) $('#ispyFeedback').textContent = 'Model: ' + state.currentClue.model; });
    $('#ispyClearBtn').addEventListener('click', () => { $('#ispyBox').value=''; $('#ispyFeedback').textContent=''; });

    // compare
    $('#cmpBuildBtn').addEventListener('click', buildComparison);
    $('#cmpSwapBtn').addEventListener('click', () => {
      const a=$('#cmpA').value, b=$('#cmpB').value;
      $('#cmpA').value=b; $('#cmpB').value=a;
      toast('Swapped.');
    });
    $('#cmpCheckBtn').addEventListener('click', checkComparison);
    $('#cmpSayBtn').addEventListener('click', () => speak($('#cmpBox').value));
    $('#cmpClearBtn').addEventListener('click', () => { $('#cmpBox').value=''; $('#cmpFeedback').textContent=''; });

    // speaking
    $('#saySpeakPromptBtn').addEventListener('click', () => speak($('#speakPrompt').textContent));
    $('#s60Btn').addEventListener('click', () => startTimer('speak', 60, 'sTimer', 'Great!'));
    $('#s90Btn').addEventListener('click', () => startTimer('speak', 90, 'sTimer', 'Great!'));
    $('#sStopBtn').addEventListener('click', () => stopTimer('speak', 'sTimer'));
    $('#sNotesClearBtn').addEventListener('click', () => { $('#sNotes').value=''; });
    $('#sNotesSayBtn').addEventListener('click', () => speak($('#sNotes').value));
    $('#sModelBtn').addEventListener('click', showSpeakingModel);
    $('#sModelSayBtn').addEventListener('click', () => speak($('#sModelOut').textContent));

    // writing
    $('#wBox').addEventListener('input', () => { $('#wWords').textContent = String(wordCount($('#wBox').value)); });
    $('#sayWritingBtn').addEventListener('click', () => speak($('#wBox').value));
    $('#w8Btn').addEventListener('click', () => startTimer('write', 8*60, 'wTimer', 'Writing time finished.'));
    $('#wStopBtn').addEventListener('click', () => stopTimer('write', 'wTimer'));
    $('#wModelBtn').addEventListener('click', showWritingModel);
    $('#wClearBtn').addEventListener('click', () => { $('#wBox').value=''; $('#wWords').textContent='0'; });
    $('#wCopyBtn').addEventListener('click', () => copyText($('#wBox').value));
  };

  window.addEventListener('error', (e) => {
    try{ showErr(e && e.message ? e.message : String(e)); }catch(_){}
  });

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();