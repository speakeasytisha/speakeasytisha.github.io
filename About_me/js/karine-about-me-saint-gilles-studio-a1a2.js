/* SpeakEasyTisha — Karine About Me & Saint-Gilles Studio (A1/A2)
Build: 20260609-164147
*/
(() => {
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const DEBUG = $("#debugBox");
  const log=(m)=>{ try{DEBUG.classList.remove("hidden"); DEBUG.textContent += "\n"+m;}catch(e){} };
  window.addEventListener("error",(e)=>log("[Error] "+e.message+" @ "+e.filename+":"+e.lineno));
  window.addEventListener("unhandledrejection",(e)=>log("[Promise] "+String(e.reason)));

  const esc=(s)=>String(s??"")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const norm=(s)=>String(s??"")
    .replace(/[’]/g,"'").replace(/[‐‑–—]/g,"-")
    .replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1")
    .trim().toLowerCase();
  const shuffle=(a)=>{a=(a||[]).slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
  const tap=(el, fn)=>{ if(!el) return; let last=0;
    const h=(e)=>{const now=Date.now(); if(now-last<320) return; last=now; try{fn(e);}catch(err){console.error(err); log(String(err));}};
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h);} 
    else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  };
  const safeOn = (el, evt, fn, opts)=>{ if(!el) return; el.addEventListener(evt, fn, opts||false); };

  const VOCAB=[{"cat": "Identity", "icon": "👋", "w": "I’m Karine.", "fr": "Je m’appelle Karine.", "def": "use to introduce your name", "ex": "I’m Karine. Nice to meet you."}, {"cat": "Identity", "icon": "🏠", "w": "I live in Saint‑Gilles‑Croix‑de‑Vie.", "fr": "J’habite à Saint‑Gilles‑Croix‑de‑Vie.", "def": "say where you live", "ex": "I live in Saint‑Gilles‑Croix‑de‑Vie, in Vendée."}, {"cat": "Identity", "icon": "📍", "w": "I’m from… / I come from…", "fr": "Je viens de…", "def": "say where you are from", "ex": "I’m from Saint‑Gilles‑Croix‑de‑Vie."}, {"cat": "Identity", "icon": "👶", "w": "I was born in…", "fr": "Je suis né(e) à…", "def": "birthplace (past)", "ex": "I was born in Vendée."}, {"cat": "Identity", "icon": "🌱", "w": "I grew up here.", "fr": "J’ai grandi ici.", "def": "childhood place", "ex": "I grew up here, near the sea."}, {"cat": "Identity", "icon": "🇫🇷", "w": "I’m French.", "fr": "Je suis française.", "def": "nationality", "ex": "I’m French."}, {"cat": "Work", "icon": "👗", "w": "a clothing store", "fr": "un magasin de vêtements", "def": "shop that sells clothes", "ex": "I worked in a clothing store."}, {"cat": "Work", "icon": "🛍️", "w": "retail", "fr": "la vente / le commerce", "def": "selling to customers", "ex": "I worked in retail."}, {"cat": "Work", "icon": "🤝", "w": "customer", "fr": "client(e)", "def": "person who buys", "ex": "I help customers."}, {"cat": "Work", "icon": "💳", "w": "cashier", "fr": "caissier / caissière", "def": "person at the cash register", "ex": "I was a cashier."}, {"cat": "Work", "icon": "✂️", "w": "hairdresser", "fr": "coiffeur / coiffeuse", "def": "person who cuts hair", "ex": "I worked as a hairdresser."}, {"cat": "Work", "icon": "💇‍♀️", "w": "salon", "fr": "salon de coiffure", "def": "place for haircuts", "ex": "I worked in a salon."}, {"cat": "Work", "icon": "📅", "w": "appointment", "fr": "rendez‑vous", "def": "scheduled time", "ex": "I have an appointment at 3 p.m."}, {"cat": "Work", "icon": "🧴", "w": "shampoo", "fr": "shampoing", "def": "wash hair product", "ex": "We start with shampoo."}, {"cat": "Work", "icon": "💨", "w": "blow‑dry", "fr": "brushing / séchage", "def": "dry hair with a dryer", "ex": "I can blow‑dry your hair."}, {"cat": "Saint‑Gilles", "icon": "🌊", "w": "a seaside town", "fr": "une ville au bord de la mer", "def": "town near the sea", "ex": "Saint‑Gilles is a seaside town."}, {"cat": "Saint‑Gilles", "icon": "⚓", "w": "a harbour / port", "fr": "un port", "def": "place for boats", "ex": "There is a harbour and boats."}, {"cat": "Saint‑Gilles", "icon": "🏖️", "w": "beach", "fr": "plage", "def": "sand by the sea", "ex": "The beach is beautiful in summer."}, {"cat": "Saint‑Gilles", "icon": "🐟", "w": "fishing", "fr": "pêche", "def": "catching fish", "ex": "The town has a fishing tradition."}, {"cat": "Saint‑Gilles", "icon": "🚶", "w": "a promenade", "fr": "une promenade", "def": "walk by the sea", "ex": "You can walk on the promenade."}, {"cat": "Saint‑Gilles", "icon": "🛒", "w": "market", "fr": "marché", "def": "open market for food", "ex": "There is a market with local food."}, {"cat": "Saint‑Gilles", "icon": "✨", "w": "special / charming", "fr": "spécial / charmant", "def": "nice and attractive", "ex": "It’s a charming place."}, {"cat": "Connectors", "icon": "➡️", "w": "First, …", "fr": "D’abord, …", "def": "start the sequence", "ex": "First, I introduce myself."}, {"cat": "Connectors", "icon": "➡️", "w": "Then, …", "fr": "Ensuite, …", "def": "next step", "ex": "Then, I talk about my work."}, {"cat": "Connectors", "icon": "➡️", "w": "After that, …", "fr": "Après ça, …", "def": "next step", "ex": "After that, I describe my town."}, {"cat": "Connectors", "icon": "⭐", "w": "Also, …", "fr": "Aussi, …", "def": "add information", "ex": "Also, I mention my hobbies."}, {"cat": "Connectors", "icon": "⚡", "w": "But, …", "fr": "Mais, …", "def": "contrast", "ex": "But I prefer quiet places."}, {"cat": "Connectors", "icon": "💡", "w": "Because…", "fr": "Parce que…", "def": "give a reason", "ex": "Because it’s near the sea."}, {"cat": "Connectors", "icon": "🏁", "w": "Finally, …", "fr": "Enfin, …", "def": "finish", "ex": "Finally, I say thank you."}];
  const VOCAB_CATS=["Identity", "Work", "Saint‑Gilles", "Connectors"];
  const MCQ=[{"id": "m1", "p": "Choose the best: ____ you have a reservation?", "choices": ["Do", "Are", "Did"], "a": 0, "h": "Present simple question: Do you…?"}, {"id": "m2", "p": "Choose the best: I ____ in Saint‑Gilles‑Croix‑de‑Vie.", "choices": ["live", "lives", "living"], "a": 0, "h": "I + base verb"}, {"id": "m3", "p": "Choose the best: I ____ in a salon before.", "choices": ["worked", "work", "works"], "a": 0, "h": "Past: worked"}, {"id": "m4", "p": "Choose the best: Saint‑Gilles is a ____ town.", "choices": ["seaside", "seat", "seaing"], "a": 0, "h": "seaside"}, {"id": "m5", "p": "Choose the connector: ____ I worked in retail, then I worked as a hairdresser.", "choices": ["First,", "Because", "Many"], "a": 0, "h": "Sequence: First"}, {"id": "m6", "p": "Choose the best: Could I have ____ bottled water, please?", "choices": ["some", "many", "much"], "a": 0, "h": "some + request"}];
  const DROPS=[{"id": "d1", "p": "Complete: I was ____ in Vendée.", "opts": ["born", "burn", "borning"], "a": 0, "h": "born"}, {"id": "d2", "p": "Complete: I grew ____ here.", "opts": ["up", "on", "in"], "a": 0, "h": "grew up"}, {"id": "d3", "p": "Complete: I worked ____ a clothing store.", "opts": ["in", "on", "at"], "a": 0, "h": "in a store"}, {"id": "d4", "p": "Complete: There is a harbour and ____ .", "opts": ["boats", "boating", "boat"], "a": 0, "h": "boats"}, {"id": "d5", "p": "Complete: I like it ____ it’s near the sea.", "opts": ["because", "but", "then"], "a": 0, "h": "because"}];
  const ORDER=[{"id": "o1", "first": "I", "words": ["was", "born", "in", "Vendée", "."], "target": "I was born in Vendée.", "hint": "I + was born + place"}, {"id": "o2", "first": "I", "words": ["worked", "in", "a", "clothing", "store", "."], "target": "I worked in a clothing store.", "hint": "I + worked in + place"}, {"id": "o3", "first": "First,", "words": ["I", "worked", "in", "retail", ",", "then", "I", "worked", "as", "a", "hairdresser", "."], "target": "First, I worked in retail, then I worked as a hairdresser.", "hint": "First, … then …"}, {"id": "o4", "first": "Where", "words": ["is", "Saint‑Gilles‑Croix‑de‑Vie", "?"], "target": "Where is Saint‑Gilles‑Croix‑de‑Vie?", "hint": "Where + is + place"}];
  const SORT={"prompt": "Sort the words into the correct category (tap OR drag).", "cats": [{"id": "id", "label": "Identity"}, {"id": "work", "label": "Work"}, {"id": "town", "label": "Town"}], "items": [{"t": "I’m from…", "cat": "id"}, {"t": "I grew up here", "cat": "id"}, {"t": "hairdresser", "cat": "work"}, {"t": "appointment", "cat": "work"}, {"t": "harbour", "cat": "town"}, {"t": "market", "cat": "town"}, {"t": "clothing store", "cat": "work"}, {"t": "seaside town", "cat": "town"}], "hint": "Identity = from/born/grew up · Work = store/salon/hairdresser · Town = beach/harbour/market"};
  const READING={"text": "Hello!\n\nI’m Karine. I’m from Saint‑Gilles‑Croix‑de‑Vie, in Vendée. It’s a seaside town with a harbour and beautiful beaches.\nI was born here and I grew up here.\n\nFirst, I worked in retail in a clothing store. Then, I worked as a hairdresser in a salon.\nI like meeting people and helping customers.\n\nNow, I want to improve my English for travel and for work.\nThank you!", "q": [["Karine is from…", "Saint‑Gilles‑Croix‑de‑Vie", "Paris", "London", 0], ["Saint‑Gilles is…", "a seaside town", "a mountain village", "a desert town", 0], ["First, she worked in…", "retail", "a hospital", "a bank", 0], ["Then, she worked as a…", "hairdresser", "pilot", "teacher", 0], ["She wants to improve English for…", "travel and work", "math", "cooking only", 0]]};
  const SCENARIOS=[{"id": "meet", "label": "Meet someone (café) · Introduce yourself", "prompt": "You meet someone new. Introduce yourself, say where you are from, and say what you do.", "model": [{"who": "Person", "side": "a", "say": "Hi! Nice to meet you. What’s your name?"}, {"who": "You", "side": "b", "say": "Hi! I’m Karine. Nice to meet you too."}, {"who": "Person", "side": "a", "say": "Where are you from?"}, {"who": "You", "side": "b", "say": "I’m from Saint‑Gilles‑Croix‑de‑Vie, in Vendée. It’s a seaside town."}, {"who": "Person", "side": "a", "say": "What do you do?"}, {"who": "You", "side": "b", "say": "I work in a salon. I’m a hairdresser."}]}, {"id": "work", "label": "Work story · Retail → Salon", "prompt": "Explain your work history with connectors: First / Then / Finally.", "model": [{"who": "Person", "side": "a", "say": "Tell me about your work experience."}, {"who": "You", "side": "b", "say": "First, I worked in retail in a clothing store. Then, I worked as a hairdresser in a salon."}, {"who": "Person", "side": "a", "say": "What do you do now?"}, {"who": "You", "side": "b", "say": "Now I work in a salon and I help customers every day."}]}, {"id": "town", "label": "Your town · What is special?", "prompt": "Describe what is special about Saint‑Gilles‑Croix‑de‑Vie: sea, harbour, beaches, market.", "model": [{"who": "Person", "side": "a", "say": "What is special about your town?"}, {"who": "You", "side": "b", "say": "It’s a charming seaside town. There is a harbour, beaches, and a market."}, {"who": "Person", "side": "a", "say": "Why do you like it?"}, {"who": "You", "side": "b", "say": "Because it’s near the sea and it’s relaxing."}]}];
  const WRITING=[{"id": "w1", "title": "About me (8–10 lines)", "prompt": "Write 8–10 simple lines about you: name, where you are from, what is special about your town, and your job history (retail → hairdresser). Use connectors (First / Then / Finally).", "modelA1": "Hello,\n\nI’m Karine. I’m from Saint‑Gilles‑Croix‑de‑Vie.\nIt’s a seaside town with a harbour and beaches.\n\nFirst, I worked in retail in a clothing store.\nThen, I worked as a hairdresser in a salon.\n\nNow I want to improve my English.\nThank you.", "modelA2": "Hello,\n\nMy name is Karine and I’m from Saint‑Gilles‑Croix‑de‑Vie, in Vendée.\nIt’s a charming seaside town with a harbour, beaches, and a market.\n\nFirst, I worked in retail in a clothing store. Then, I became a hairdresser and I worked in a salon.\nNow, I want to improve my English for travel and for work.\n\nKind regards,\nKarine"}, {"id": "w2", "title": "Mini guide (5 lines) · Visit Saint‑Gilles", "prompt": "Write 5 lines to Fabrice: recommend Saint‑Gilles‑Croix‑de‑Vie. Use: First / Then / Finally.", "modelA1": "Hi Fabrice,\n\nFirst, let’s walk by the harbour.\nThen, we can go to the beach.\nFinally, we can visit the market.\n\nLove,\nKarine", "modelA2": "Hi Fabrice,\n\nFirst, let’s walk along the harbour and the promenade.\nThen, we can relax at the beach.\nFinally, we can visit the market and try local food.\n\nLove,\nKarine"}];

  const KEYS={lang:"k_about_lang", voice:"k_about_voice", auto:"k_about_auto"};
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
      u.rate=0.97; u.pitch=1.02;
      window.speechSynthesis.speak(u);
    }
  };

  const Score={now:0,max:0,awarded:new Set(),
    setMax(n){this.max=n; upd();},
    award(k,pts=1){ if(this.awarded.has(k)) return; this.awarded.add(k); this.now+=pts; upd(); },
    reset(){ this.now=0; this.awarded.clear(); upd(); }
  };
  function upd(){
    $("#scoreNow").textContent=String(Score.now);
    $("#scoreMax").textContent=String(Score.max);
    const pct=Score.max?Math.round((Score.now/Score.max)*100):0;
    $("#progressBar").style.width=Math.max(0,Math.min(100,pct))+"%";
  }

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

  // Vocab
  const V={cat:VOCAB_CATS[0], revealed:new Set()};
  function renderVocabPick(){
    const sel=$("#vCat");
    sel.innerHTML = VOCAB_CATS.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
    sel.value=V.cat;
    safeOn(sel,"change",()=>{V.cat=sel.value; renderVGrid();});
  }
  function renderVGrid(){
    const grid=$("#vGrid"); grid.innerHTML="";
    const list=VOCAB.filter(x=>x.cat===V.cat);
    list.forEach(it=>{
      const key=it.cat+"::"+it.w;
      const open=V.revealed.has(key);
      const card=document.createElement("div");
      card.className="card vocabCard";
      card.innerHTML=`<div class="vocabTop"><div class="vocabWord">${esc(it.icon)} ${esc(it.w)}</div>
        <div class="vocabBtns"><button class="toolmini" data-a="s">🔊</button><button class="toolmini" data-a="t">${open?"🙈 Hide":"👀 Reveal"}</button></div></div>
        <div class="kcard ${open?"":"hidden"}" data-box="b">
          <div><strong>Meaning:</strong> ${esc(it.def)}</div>
          <div style="color:var(--muted);font-weight:850"><strong>FR:</strong> ${esc(it.fr)}</div>
          <div><strong>Example:</strong> ${esc(it.ex)}</div>
        </div>`;
      const box=card.querySelector("[data-box='b']");
      const btn=card.querySelector("[data-a='t']");
      tap(btn,()=>{ const hidden=box.classList.contains("hidden");
        if(hidden){ box.classList.remove("hidden"); V.revealed.add(key); btn.textContent="🙈 Hide"; }
        else { box.classList.add("hidden"); V.revealed.delete(key); btn.textContent="👀 Reveal"; }
      });
      tap(card.querySelector("[data-a='s']"),()=>TTS.say(it.w+". "+it.ex));
      tap(card,(e)=>{ if(e?.target?.closest("button")) return; btn.click(); });
      grid.appendChild(card);
    });
  }
  function vocabQuiz(){
    const list=VOCAB.filter(x=>x.cat===V.cat);
    const sample=shuffle(list).slice(0, Math.min(6, list.length));
    const fb=$("#vFb"); fb.classList.remove("hidden","ok","no","warn"); fb.classList.add("ok"); fb.innerHTML="";
    const wrap=document.createElement("div"); wrap.className="kcard";
    wrap.innerHTML=`<strong>${esc(V.cat)} · Quick quiz (${sample.length})</strong><div class="tiny" style="color:var(--muted)">Choose the best meaning.</div>`;
    const meta=[];
    sample.forEach((it,i)=>{
      const choices=shuffle([it.def,"a surfboard","a mountain"]);
      meta.push({ans:choices.indexOf(it.def)});
      wrap.innerHTML += `<div class="kcard" style="margin-top:.55rem"><div><strong>Q${i+1}:</strong> ${esc(it.w)}</div>`+
        choices.map((c,ci)=>`<label class="choice"><input type="radio" name="vq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")+
      `</div>`;
    });
    wrap.innerHTML += `<div class="smallrow"><button class="btn" id="vqCheck">✅ Check</button><button class="btn btn--ghost" id="vqClose">✖ Close</button></div><div class="feedback hidden" id="vqFb"></div>`;
    fb.appendChild(wrap);
    tap($("#vqClose"),()=>{fb.classList.add("hidden"); fb.textContent="";});
    tap($("#vqCheck"),()=>{
      let correct=0;
      meta.forEach((m,i)=>{ const c=document.querySelector(`input[name="vq${i}"]:checked`); if(c && parseInt(c.value,10)===m.ans) correct++; });
      const b=$("#vqFb"); b.classList.remove("hidden","ok","no","warn"); b.classList.add(correct>=Math.max(4, sample.length-1)?"ok":"warn");
      b.textContent=`Score: ${correct}/${sample.length}`;
      Score.award("vocabQuiz:"+V.cat, correct);
    });
  }

  // runners
  function makeMCQ(hostSel, fbSel, items, keyPrefix, pts=2){
    const S={order:[], idx:0, cur:null};
    const host=$(hostSel), fb=$(fbSel);
    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      host.innerHTML = `<div><strong>${esc(S.cur.p)}</strong></div>`+
        S.cur.choices.map((c,i)=>`<label class="choice"><input type="radio" name="mcq" value="${i}"/><div>${esc(c)}</div></label>`).join("");
    }
    function start(){ S.order=shuffle(items.map(x=>x.id)); S.idx=0; next(true); }
    function next(fromStart=false){
      if(!S.order.length) return;
      if(!fromStart) S.idx++;
      if(S.idx>=S.order.length) S.idx=0;
      S.cur=items.find(x=>x.id===S.order[S.idx]);
      fb.classList.add("hidden"); render();
    }
    function hint(){ fb.classList.remove("hidden","ok","no","warn"); fb.classList.add("warn"); fb.textContent="💡 "+(S.cur?.h||""); }
    function check(){
      fb.classList.remove("hidden","ok","no","warn");
      const c=document.querySelector('input[name="mcq"]:checked');
      if(!c){ fb.classList.add("warn"); fb.textContent="Choose an answer first."; return; }
      const ok = parseInt(c.value,10)===S.cur.a;
      fb.classList.add(ok?"ok":"no"); fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
      if(ok) Score.award(`${keyPrefix}:${S.cur.id}`, pts);
    }
    function reset(){ S.order=[]; S.cur=null; fb.classList.add("hidden"); host.textContent="Click Start."; }
    return {start,next,check,hint,reset};
  }

  function makeDrop(hostSel, fbSel, items, keyPrefix, pts=2){
    const S={order:[], idx:0, cur:null};
    const host=$(hostSel), fb=$(fbSel);
    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      host.innerHTML=`<div><strong>${esc(S.cur.p)}</strong></div>
        <select class="select" id="ddSel">${S.cur.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>`;
    }
    function start(){ S.order=shuffle(items.map(x=>x.id)); S.idx=0; next(true); }
    function next(fromStart=false){
      if(!S.order.length) return;
      if(!fromStart) S.idx++;
      if(S.idx>=S.order.length) S.idx=0;
      S.cur=items.find(x=>x.id===S.order[S.idx]);
      fb.classList.add("hidden"); render();
    }
    function hint(){ fb.classList.remove("hidden","ok","no","warn"); fb.classList.add("warn"); fb.textContent="💡 "+(S.cur?.h||""); }
    function check(){
      fb.classList.remove("hidden","ok","no","warn");
      const val=parseInt($("#ddSel").value,10);
      const ok = val===S.cur.a;
      fb.classList.add(ok?"ok":"no"); fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
      if(ok) Score.award(`${keyPrefix}:${S.cur.id}`, pts);
    }
    function reset(){ S.order=[]; S.cur=null; fb.classList.add("hidden"); host.textContent="Click Start."; }
    return {start,next,check,hint,reset};
  }

  // Word order
  const Ord={order:[], idx:0, cur:null};
  function ordRender(){
    const host=$("#ordHost");
    if(!Ord.cur){ host.textContent="Click Start."; return; }
    const q=Ord.cur;
    const words=shuffle(q.words.slice());
    host.innerHTML=`<div class="badge">First word</div> <strong>${esc(q.first)}</strong>
      <div class="bank" id="oBank" style="margin-top:.55rem"></div>
      <div class="zone" id="oZone" style="margin-top:.55rem"></div>
      <div class="tiny" style="color:var(--muted);margin-top:.35rem">Tap words to add. Tap a word in your sentence to remove.</div>`;
    const bank=host.querySelector("#oBank");
    const zone=host.querySelector("#oZone");
    const add=(tok)=>{
      tok.classList.add("is-used");
      const c=tok.cloneNode(true); c.classList.remove("is-used");
      tap(c,()=>{c.remove(); tok.classList.remove("is-used");});
      zone.appendChild(c);
    };
    words.forEach(w=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=w; t.dataset.word=w; t.draggable=true;
      tap(t,()=>{ if(t.classList.contains("is-used")) return; add(t); });
      safeOn(t,"dragstart",(e)=>e.dataTransfer.setData("text/plain", w));
      bank.appendChild(t);
    });
    safeOn(zone,"dragover",(e)=>e.preventDefault());
    safeOn(zone,"drop",(e)=>{
      e.preventDefault();
      const w=e.dataTransfer.getData("text/plain");
      const tok=Array.from(bank.querySelectorAll(".token")).find(x=>x.dataset.word===w && !x.classList.contains("is-used"));
      if(tok) add(tok);
    });
  }
  function ordStart(){ Ord.order=shuffle(ORDER.map(x=>x.id)); Ord.idx=0; ordNext(true); }
  function ordNext(fromStart=false){
    if(!Ord.order.length) return;
    if(!fromStart) Ord.idx++;
    if(Ord.idx>=Ord.order.length) Ord.idx=0;
    Ord.cur=ORDER.find(x=>x.id===Ord.order[Ord.idx]);
    $("#ordFb").classList.add("hidden"); ordRender();
  }
  function ordHint(){ const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no","warn"); fb.classList.add("warn"); fb.textContent="💡 "+(Ord.cur?.hint||""); }
  function ordCheck(){
    const q=Ord.cur;
    const zone=$("#ordHost").querySelector("#oZone");
    const built=[q.first].concat($$(".token", zone).map(t=>t.textContent.trim())).join(" ").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no","warn"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award("order:"+q.id,4);
  }
  function ordReset(){ Ord.order=[]; Ord.cur=null; $("#ordFb").classList.add("hidden"); $("#ordHost").textContent="Click Start."; }

  // Sorting
  function sortRender(){
    const host=$("#sortHost");
    host.innerHTML=`<div><strong>${esc(SORT.prompt)}</strong></div>
      <div class="bank" id="sBank" style="margin-top:.55rem"></div>
      <div class="grid3" style="margin-top:.55rem">
        ${SORT.cats.map(c=>`<div class="kcard"><div class="badge">${esc(c.label)}</div><div class="zone" data-cat="${esc(c.id)}" style="margin-top:.45rem"></div></div>`).join("")}
      </div>
      <div class="tiny" style="color:var(--muted);margin-top:.35rem">Tap OR drag items.</div>`;
    const bank=host.querySelector("#sBank");
    const zones=$$("[data-cat]", host);
    shuffle(SORT.items.slice()).forEach(it=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=it.t; t.dataset.answer=it.cat; t.draggable=true;
      tap(t,()=>{ const z=zones.find(x=>x.dataset.cat===it.cat); if(z) z.appendChild(t); });
      safeOn(t,"dragstart",(e)=>e.dataTransfer.setData("text/plain", it.t));
      bank.appendChild(t);
    });
    zones.forEach(z=>{
      safeOn(z,"dragover",(e)=>e.preventDefault());
      safeOn(z,"drop",(e)=>{
        e.preventDefault();
        const txt=e.dataTransfer.getData("text/plain");
        const tok=Array.from(host.querySelectorAll(".token")).find(x=>x.textContent===txt);
        if(tok) z.appendChild(tok);
      });
    });
  }
  function sortHint(){ const fb=$("#sortFb"); fb.classList.remove("hidden","ok","no","warn"); fb.classList.add("warn"); fb.textContent="💡 "+SORT.hint; }
  function sortCheck(){
    const host=$("#sortHost");
    let total=0, correct=0;
    $$("[data-cat]", host).forEach(z=>{
      const cat=z.dataset.cat;
      $$(".token", z).forEach(t=>{ total++; if(t.dataset.answer===cat) correct++; });
    });
    const fb=$("#sortFb"); fb.classList.remove("hidden","ok","no","warn");
    const ok= total===SORT.items.length && correct===total;
    fb.classList.add(ok?"ok":"warn");
    fb.textContent = ok ? "✅ Perfect sorting!" : `Score: ${correct}/${SORT.items.length}`;
    if(ok) Score.award("sort",6);
  }
  function sortReset(){ $("#sortFb").classList.add("hidden"); sortRender(); }

  // Reading
  function renderReading(){
    $("#readText").textContent = READING.text;
    const host=$("#readQHost");
    host.innerHTML = READING.q.map((q,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div><strong>Q${i+1}:</strong> ${esc(q[0])}</div>
      ${[q[1],q[2],q[3]].map((c,ci)=>`<label class="choice"><input type="radio" name="rq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")}
    </div>`).join("");
  }
  function readReset(){ renderReading(); $("#readFb").classList.add("hidden"); }
  function readHint(){ const fb=$("#readFb"); fb.classList.remove("hidden","ok","no","warn"); fb.classList.add("warn"); fb.textContent="💡 Look for: from / seaside town / first / then / travel and work."; }
  function readCheck(){
    let correct=0;
    READING.q.forEach((q,i)=>{
      const c=document.querySelector(`input[name="rq${i}"]:checked`);
      if(c && parseInt(c.value,10)===q[4]){ correct++; Score.award("read:"+i,2); }
    });
    const fb=$("#readFb"); fb.classList.remove("hidden","ok","no","warn");
    fb.classList.add(correct>=4?"ok":"warn");
    fb.textContent=`Score: ${correct}/${READING.q.length}`;
  }

  // Speaking
  const Sc={id:SCENARIOS[0].id, show:false};
  function curSc(){ return SCENARIOS.find(x=>x.id===Sc.id) || SCENARIOS[0]; }
  function renderScPick(){
    const sel=$("#scPick");
    sel.innerHTML = SCENARIOS.map(s=>`<option value="${esc(s.id)}">${esc(s.label)}</option>`).join("");
    sel.value=Sc.id;
    safeOn(sel,"change",()=>{Sc.id=sel.value; Sc.show=false; renderScenario(); renderSpeakBuilder(); $("#sBuildFb").classList.add("hidden");});
  }
  function renderScenario(){
    const s=curSc();
    $("#scPrompt").innerHTML = `<div class="badge">Prompt</div><div style="margin-top:.35rem">${esc(s.prompt)}</div>`;
    const host=$("#scDialog"); host.innerHTML="";
    s.model.forEach(ln=>{
      const b=document.createElement("div");
      b.className="bubble "+(ln.side==="a"?"a":"b");
      b.innerHTML=`<div class="who">${ln.side==="a"?"🟦":"💖"} ${esc(ln.who)}</div>
        <div class="txt">${Sc.show?esc(ln.say):"<span class='badge'>Hidden</span>"}</div>
        <div class="tools"><button class="toolmini" data-a="s">🔊 Listen</button></div>`;
      tap(b.querySelector('[data-a="s"]'),()=>TTS.say(ln.say));
      host.appendChild(b);
    });
  }
  function scPlayAll(){
    const s=curSc(); let i=0;
    const next=()=>{ if(i>=s.model.length) return; TTS.say(s.model[i].say); i++; setTimeout(next, 1750); };
    next();
  }
  function scShow(){ Sc.show=true; renderScenario(); }
  function scHide(){ Sc.show=false; renderScenario(); }

  const SB = {
    parts:[
      {label:"Greeting", opts:["Hi!","Hello!","Good morning."]},
      {label:"Name + from", opts:[
        "I’m Karine. I’m from Saint‑Gilles‑Croix‑de‑Vie.",
        "My name is Karine. I’m from Vendée.",
        "I’m Karine. I live in Saint‑Gilles‑Croix‑de‑Vie."
      ]},
      {label:"Town special", opts:[
        "It’s a seaside town with a harbour and beaches.",
        "It’s charming and relaxing because it’s near the sea.",
        "There is a harbour, a market, and beautiful beaches."
      ]},
      {label:"Work (now)", opts:[
        "Now I work in a salon. I’m a hairdresser.",
        "I work in a salon and I help customers.",
        "I’m a hairdresser and I have appointments."
      ]},
      {label:"Work (before) + connector", opts:[
        "First, I worked in retail in a clothing store.",
        "Then, I worked as a hairdresser in a salon.",
        "Before, I worked in a clothing store."
      ]},
      {label:"Closing", opts:["Nice to meet you.","Thank you.","That’s me!"]}
    ]
  };
  function renderSpeakBuilder(){
    const host=$("#sBuilder");
    host.innerHTML = SB.parts.map((p,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div class="badge">${esc(p.label)}</div>
      <select class="select" data-sb="${i}" style="margin-top:.35rem">
        ${p.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}
      </select>
    </div>`).join("");
    $$('select[data-sb]', host).forEach(sel=>safeOn(sel,'change', updateSpeakOut));
    updateSpeakOut();
  }
  function updateSpeakOut(){
    const vals=$$('select[data-sb]', $("#sBuilder")).map(s=>s.value);
    const out=vals.join(" ").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    $("#sOut").textContent=out;
  }
  function sBuildListen(){ TTS.say($("#sOut").textContent); }
  function sBuildReset(){ renderSpeakBuilder(); $("#sBuildFb").classList.add("hidden"); }
  function sBuildCheck(){
    const t=$("#sOut").textContent.toLowerCase();
    const ok = (t.includes("from") || t.includes("live")) && (t.includes("work") || t.includes("worked")) && (t.includes("first") || t.includes("then") || t.includes("before"));
    const fb=$("#sBuildFb"); fb.classList.remove("hidden","ok","no","warn"); fb.classList.add(ok?"ok":"warn");
    fb.textContent = ok ? "✅ Great! Clear and structured." : "⚠️ Add: where you are from/live + work now + one connector (First/Then/Before).";
    if(ok) Score.award("speakBuilder",8);
  }

  // Writing
  const W={id:WRITING[0].id};
  function curW(){ return WRITING.find(x=>x.id===W.id) || WRITING[0]; }
  function renderWPick(){
    const sel=$("#wPick");
    sel.innerHTML = WRITING.map(w=>`<option value="${esc(w.id)}">${esc(w.title)}</option>`).join("");
    sel.value=W.id;
    safeOn(sel,"change",()=>{W.id=sel.value; renderWriting(); $("#wFb").classList.add("hidden"); $("#wModel").classList.add("hidden"); $("#wInput").value="";});
  }
  function renderWriting(){
    const w=curW();
    $("#wPrompt").innerHTML = `<div class="badge">Prompt</div><div style="margin-top:.35rem">${esc(w.prompt)}</div>`;
  }
  function wShow(){
    const w=curW();
    const box=$("#wModel");
    box.classList.remove("hidden");
    box.innerHTML = `<div class="badge gold">Model A1</div>\n${esc(w.modelA1)}\n\n<div class="badge gold" style="margin-top:.55rem">Model A2</div>\n${esc(w.modelA2)}`;
  }
  function wHide(){ $("#wModel").classList.add("hidden"); }
  function wReset(){ $("#wInput").value=""; $("#wFb").classList.add("hidden"); $("#wModel").classList.add("hidden"); }
  function wSelf(){
    const text=$("#wInput").value || "";
    const low=text.toLowerCase();
    const tips=[];
    let pts=0;
    if(/i[' ]?m karine|my name is karine/.test(low)) pts+=1; else tips.push("Add your name (I’m Karine).");
    if(/from|live in/.test(low)) pts+=1; else tips.push("Add where you are from/live.");
    if(/saint|seaside|harbour|beach|market/.test(low)) pts+=1; else tips.push("Add what is special about your town.");
    if(/first|then|after that|finally/.test(low)) pts+=1; else tips.push("Add connectors (First/Then/Finally).");
    if(/worked|work/.test(low)) pts+=1; else tips.push("Add your work (retail / hairdresser).");
    const fb=$("#wFb"); fb.classList.remove("hidden","ok","no","warn");
    fb.classList.add(pts>=4?"ok":"warn");
    fb.innerHTML = `<strong>Self-check:</strong> ${pts}/5<br/>` + (tips.length?("Tips: "+tips.join(" ")): "Great structure!");
    if(pts>=4) Score.award("writingSelf:"+W.id,6);
  }

  function insertAtCursor(textarea, insertText){
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    textarea.value = textarea.value.slice(0,start) + insertText + textarea.value.slice(end);
    const pos = start + insertText.length;
    textarea.setSelectionRange(pos,pos);
    textarea.focus();
  }

  async function init(){
    if(localStorage.getItem(KEYS.auto)===null) TTS.setAuto(false);
    Score.setMax(80);

    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    safeOn($("#voiceSelect"),"change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});
    tap($("#btnTestVoice"),()=>TTS.say("Hello. I’m Karine. I’m from Saint-Gilles-Croix-de-Vie. It’s a seaside town."));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnResetAll"),()=>{ if(confirm("Reset the whole page?")) resetAll(); });
    tap($("#btnStart"),()=>document.getElementById("secVocab").scrollIntoView({behavior:"smooth"}));
    tap($("#btnHow"),()=>alert("How to use:\n\n1) Vocabulary: choose a category and reveal meanings.\n2) Practice lab: QCM, fill blanks, word order, sorting.\n3) Reading: read and answer questions.\n4) Speaking: choose a scenario + use the builder.\n5) Writing: do the tasks, then compare with model answers.\n\nAudio is OFF by default. Use listen buttons when you want."));

    renderVocabPick(); renderVGrid();
    tap($("#vRevealAll"),()=>{VOCAB.filter(x=>x.cat===V.cat).forEach(it=>V.revealed.add(it.cat+'::'+it.w)); renderVGrid();});
    tap($("#vHideAll"),()=>{VOCAB.filter(x=>x.cat===V.cat).forEach(it=>V.revealed.delete(it.cat+'::'+it.w)); renderVGrid();});
    tap($("#vQuiz"),()=>vocabQuiz());

    const mcq = makeMCQ("#mcqHost","#mcqFb",MCQ,"mcq",2);
    tap($("#mcqStart"),()=>mcq.start());
    tap($("#mcqCheck"),()=>mcq.check());
    tap($("#mcqNext"),()=>mcq.next(false));
    tap($("#mcqHint"),()=>mcq.hint());
    tap($("#mcqReset"),()=>mcq.reset());

    const dd = makeDrop("#ddHost","#ddFb",DROPS,"drop",2);
    tap($("#ddStart"),()=>dd.start());
    tap($("#ddCheck"),()=>dd.check());
    tap($("#ddNext"),()=>dd.next(false));
    tap($("#ddHint"),()=>dd.hint());
    tap($("#ddReset"),()=>dd.reset());

    tap($("#ordStart"),()=>ordStart());
    tap($("#ordCheck"),()=>ordCheck());
    tap($("#ordHint"),()=>ordHint());
    tap($("#ordNext"),()=>ordNext(false));
    tap($("#ordReset"),()=>ordReset());

    sortRender();
    tap($("#sortCheck"),()=>sortCheck());
    tap($("#sortHint"),()=>sortHint());
    tap($("#sortReset"),()=>sortReset());

    renderReading();
    tap($("#readListen"),()=>TTS.say(READING.text));
    tap($("#readCheck"),()=>readCheck());
    tap($("#readHint"),()=>readHint());
    tap($("#readReset"),()=>readReset());

    renderScPick(); renderScenario(); renderSpeakBuilder();
    tap($("#scShow"),()=>scShow());
    tap($("#scHide"),()=>scHide());
    tap($("#scPlayAll"),()=>scPlayAll());

    tap($("#sBuildListen"),()=>sBuildListen());
    tap($("#sBuildCheck"),()=>sBuildCheck());
    tap($("#sBuildReset"),()=>sBuildReset());

    renderWPick(); renderWriting();
    tap($("#wShow"),()=>wShow());
    tap($("#wHide"),()=>wHide());
    tap($("#wReset"),()=>wReset());
    tap($("#wSelf"),()=>wSelf());

    $$('button[data-ins]').forEach(btn=>tap(btn,()=>insertAtCursor($("#wInput"), btn.dataset.ins)));

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  function resetAll(){
    TTS.stop(); Score.reset();
    document.querySelectorAll('input[type="radio"]').forEach(i=>i.checked=false);
    $("#wInput").value="";
    ["vFb","mcqFb","ddFb","ordFb","sortFb","readFb","sBuildFb","wFb"].forEach(id=>$("#"+id)?.classList.add("hidden"));
    $("#wModel").classList.add("hidden");
    renderVGrid(); sortRender(); renderReading(); renderScenario(); renderSpeakBuilder(); renderWriting();
    document.getElementById("top").scrollIntoView({behavior:"smooth"});
  }

  init();
})();
