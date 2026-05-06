/* SpeakEasyTisha — Karine Practice Studio (A1+)
Build: 20260506-102132
*/
(() => {
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  function esc(s){
    return String(s ?? "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }
  function norm(s){
    return String(s ?? "")
      .replace(/\u00A0/g," ")
      .replace(/[’']/g,"'")
      .replace(/[\u2010\u2011\u2012\u2013\u2014]/g,"-")
      .replace(/\s+([,?.!])/g,"$1")
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();
  }
  function shuffle(arr){
    const a=(arr||[]).slice();
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function attachTap(el, fn){
    if(!el) return;
    let last=0;
    const h=(e)=>{
      const now=Date.now();
      if(now-last<320) return;
      last=now;
      try{ fn(e); }catch(err){ console.error(err); }
    };
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h); }
    else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  }

  // ---------- TTS ----------
  const KEYS = { lang:"kps_tts_lang", voice:"kps_tts_voice", auto:"kps_auto" };

  const TTS = {
    lang: localStorage.getItem(KEYS.lang) || "en-US",
    voiceName: localStorage.getItem(KEYS.voice) || "",
    auto: (localStorage.getItem(KEYS.auto)==="1"),
    voices: [],
    async loadVoices(){
      if(!window.speechSynthesis) return [];
      const got = window.speechSynthesis.getVoices() || [];
      if(got.length){ this.voices=got; return got; }
      return await new Promise((resolve)=>{
        window.speechSynthesis.onvoiceschanged = () => {
          this.voices = window.speechSynthesis.getVoices() || [];
          resolve(this.voices);
        };
        setTimeout(()=>resolve(this.voices), 900);
      });
    },
    pickVoice(){
      const v = this.voices.length ? this.voices : (window.speechSynthesis?.getVoices?.() || []);
      if(this.voiceName){
        const byName=v.find(x=>x.name===this.voiceName);
        if(byName) return byName;
      }
      const lang=(this.lang||"en-US").toLowerCase();
      let best=v.find(x=>(x.lang||"").toLowerCase()===lang);
      if(!best) best=v.find(x=>(x.lang||"").toLowerCase().startsWith(lang));
      if(!best) best=v.find(x=>(x.lang||"").toLowerCase().startsWith("en"));
      return best||null;
    },
    setLang(lang){ this.lang=lang; localStorage.setItem(KEYS.lang, lang); },
    setVoiceName(name){ this.voiceName=name||""; localStorage.setItem(KEYS.voice, this.voiceName); },
    setAuto(on){ this.auto=!!on; localStorage.setItem(KEYS.auto, this.auto?"1":"0"); },
    stop(){ try{ window.speechSynthesis?.cancel(); }catch(e){} },
    say(text){
      if(!window.speechSynthesis) return;
      try{ window.speechSynthesis.cancel(); }catch(e){}
      const u=new SpeechSynthesisUtterance(String(text||""));
      u.lang=this.lang || "en-US";
      const voice=this.pickVoice();
      if(voice) u.voice=voice;
      u.rate=0.97; u.pitch=1.0;
      window.speechSynthesis.speak(u);
    }
  };

  function syncAccentButtons(){
    const us=$("#voiceUS"), uk=$("#voiceUK");
    if(!us||!uk) return;
    if(TTS.lang==="en-US"){
      us.classList.add("is-on"); uk.classList.remove("is-on");
      us.setAttribute("aria-pressed","true"); uk.setAttribute("aria-pressed","false");
    } else {
      uk.classList.add("is-on"); us.classList.remove("is-on");
      uk.setAttribute("aria-pressed","true"); us.setAttribute("aria-pressed","false");
    }
  }
  function syncAutoButtons(){
    const onb=$("#autoOn"), off=$("#autoOff");
    if(!onb||!off) return;
    if(TTS.auto){
      onb.classList.add("is-on"); off.classList.remove("is-on");
      onb.setAttribute("aria-pressed","true"); off.setAttribute("aria-pressed","false");
    } else {
      off.classList.add("is-on"); onb.classList.remove("is-on");
      off.setAttribute("aria-pressed","true"); onb.setAttribute("aria-pressed","false");
    }
  }
  async function rebuildVoiceSelect(){
    await TTS.loadVoices();
    const sel=$("#voiceSelect");
    if(!sel) return;
    sel.innerHTML="";
    const opt0=document.createElement("option");
    opt0.value="";
    opt0.textContent="Auto (best match)";
    sel.appendChild(opt0);

    const v=TTS.voices || [];
    const sorted=v.slice().sort((a,b)=>{
      const ae=(a.lang||"").toLowerCase().startsWith("en")?0:1;
      const be=(b.lang||"").toLowerCase().startsWith("en")?0:1;
      if(ae!==be) return ae-be;
      return (a.lang||"").localeCompare(b.lang||"") || (a.name||"").localeCompare(b.name||"");
    });
    sorted.forEach(voice=>{
      const o=document.createElement("option");
      o.value=voice.name;
      o.textContent=`${voice.name} — ${voice.lang}`;
      sel.appendChild(o);
    });
    sel.value = TTS.voiceName || "";
  }
  function testVoice(){
    TTS.say("Hello! This is a pronunciation test. Could you repeat that, please?");
  }

  // ---------- Score ----------
  const Score = {
    now:0, max:0, awarded:new Set(),
    setMax(n){ this.max=n; updateScore(); },
    award(key, pts=1){ if(this.awarded.has(key)) return; this.awarded.add(key); this.now+=pts; updateScore(); },
    reset(){ this.now=0; this.awarded.clear(); updateScore(); }
  };
  function updateScore(){
    $("#scoreNow").textContent=String(Score.now);
    $("#scoreMax").textContent=String(Score.max);
    const bar=$("#progressBar");
    const pct = Score.max ? Math.round((Score.now/Score.max)*100) : 0;
    bar.style.width = `${Math.max(0,Math.min(100,pct))}%`;
  }

  // ---------- Data ----------
  const VOCAB = [{"cat": "Hotel", "icon": "🏨", "w": "reservation", "fr": "réservation", "def": "a booking", "ex": "I have a reservation under Karine Cormier."}, {"cat": "Hotel", "icon": "🏨", "w": "check‑in", "fr": "arrivée (hôtel)", "def": "when you arrive and get your room", "ex": "What time is check‑in?"}, {"cat": "Hotel", "icon": "🏨", "w": "check‑out", "fr": "départ (hôtel)", "def": "when you leave and return the key", "ex": "Check‑out is at 11 a.m."}, {"cat": "Hotel", "icon": "🏨", "w": "included", "fr": "inclus", "def": "part of the price (no extra cost)", "ex": "Is breakfast included?"}, {"cat": "Hotel", "icon": "🏨", "w": "bottled water", "fr": "eau en bouteille", "def": "water in a bottle (often extra)", "ex": "Is bottled water included or extra?"}, {"cat": "Hotel", "icon": "🏨", "w": "quiet", "fr": "calme", "def": "not noisy", "ex": "I’d like a quiet room, please."}, {"cat": "Restaurant", "icon": "🍽️", "w": "menu", "fr": "menu", "def": "the list of food and drinks", "ex": "Could I have the menu, please?"}, {"cat": "Restaurant", "icon": "🍽️", "w": "bill / check", "fr": "addition", "def": "the paper with the total price", "ex": "Could I have the bill, please?"}, {"cat": "Tickets", "icon": "🎟️", "w": "ticket", "fr": "billet", "def": "paper or digital entry / travel pass", "ex": "Two tickets, please."}, {"cat": "Tickets", "icon": "🎟️", "w": "fee", "fr": "frais", "def": "an extra cost", "ex": "Is there a booking fee?"}, {"cat": "Tickets", "icon": "🎟️", "w": "rate", "fr": "tarif", "def": "a price level", "ex": "What is the student rate?"}, {"cat": "Directions", "icon": "🧭", "w": "near", "fr": "près de", "def": "not far from", "ex": "Is the museum near the hotel?"}, {"cat": "Directions", "icon": "🧭", "w": "next to", "fr": "à côté de", "def": "beside", "ex": "The washroom is next to the café."}, {"cat": "Directions", "icon": "🧭", "w": "across from", "fr": "en face de", "def": "on the other side of the street", "ex": "The station is across from the park."}, {"cat": "Small talk", "icon": "💬", "w": "nationality", "fr": "nationalité", "def": "the country you are from", "ex": "What’s your nationality?"}, {"cat": "Small talk", "icon": "💬", "w": "weather", "fr": "météo", "def": "sunny, cloudy, rainy…", "ex": "How’s the weather today?"}];
  const GRAMMAR = {"polite": {"title": "Polite requests (A1+) — the 3 magic patterns", "rule": ["1) I’d like + noun / to + verb", "2) Could I have + noun? (restaurant / hotel)", "3) Could you + verb, please? (ask someone to do something)"], "examples": ["I’d like a quiet room, please.", "Could I have the menu, please?", "Could you repeat that, please?"], "note": "Use 'please' at the end. Keep it short."}, "questions": {"title": "Questions — the simple structure", "rule": ["Present simple: Do you…? / Does she…?", "Be: Is it…? / Are you…?", "Modal: Can you…? / Could you…?", "Word order: (Question word) + auxiliary + subject + verb…"], "examples": ["Do you have parking?", "Is breakfast included?", "Where is the washroom, please?", "Could you help me, please?"], "note": "If you are unsure, start with: Excuse me, …"}, "preps": {"title": "Prepositions + directions (store / city)", "rule": ["Prepositions: next to, between, near, across from, in front of, behind", "Direction verbs: go straight, turn left/right, take the first/second left", "Sequence: First, then, after that, finally"], "examples": ["Go straight for two blocks, then turn left.", "The washroom is next to the café.", "The museum is across from the park."], "note": "In Canada you may hear 'washroom' (toilet)."}, "comparatives": {"title": "Comparatives & superlatives (A1+)", "rule": ["Short adjective: cheaper / bigger / nicer (add -er)", "Long adjective: more expensive / more comfortable (use more)", "Superlative: the cheapest / the most comfortable"], "examples": ["This hotel is cheaper than that one.", "This room is more comfortable.", "It’s the best option for us."], "note": "Than = que (comparison)."}, "past": {"title": "Past simple for reviews (starter)", "rule": ["Affirmative: We stayed / It was / We had…", "Negative: We didn’t like… / It wasn’t clean.", "Question: Was it clean? / Did you enjoy it?"], "examples": ["We stayed in Toronto last week.", "The room was clean, but it was noisy.", "We didn’t like the service."], "note": "Only a light introduction for now."}};
  const MCQ = [{"id": "mcq1", "prompt": "Choose the best meaning: reservation", "choices": ["a booking", "a suitcase", "a bathroom"], "ans": 0, "hint": "Reservation = booking."}, {"id": "mcq2", "prompt": "Choose the best meaning: included", "choices": ["inside", "part of the price", "very expensive"], "ans": 1, "hint": "Included = no extra cost."}, {"id": "mcq3", "prompt": "Choose the best sentence (polite):", "choices": ["Give me the check.", "Could I have the check, please?", "Check now."], "ans": 1, "hint": "Could I have… please?"}, {"id": "mcq4", "prompt": "Which question is correct?", "choices": ["Where is the washroom?", "Where washroom is?", "Where the washroom?"], "ans": 0, "hint": "Where is + noun…"}, {"id": "mcq5", "prompt": "Choose the correct comparative: This hotel is ____ than that one.", "choices": ["cheaper", "the cheapest", "more cheaper"], "ans": 0, "hint": "Cheaper than…"}];
  const DROPDOWNS = [{"id": "dd1", "prompt": "Complete: I ___ like a quiet room, please.", "opts": ["would", "do", "am"], "ans": 0, "hint": "I would like…"}, {"id": "dd2", "prompt": "Complete: ___ breakfast included?", "opts": ["Is", "Do", "Are"], "ans": 0, "hint": "Is + noun…"}, {"id": "dd3", "prompt": "Complete: Could you ___ that, please?", "opts": ["repeat", "repeating", "repeats"], "ans": 0, "hint": "After could → base verb."}, {"id": "dd4", "prompt": "Complete: The museum is ____ the park.", "opts": ["across from", "across of", "across"], "ans": 0, "hint": "Across from."}];
  const ORDER_TASKS = [{"id": "ord1", "first": "Could", "words": ["you", "recommend", "a", "good", "restaurant,", "please?"], "target": "Could you recommend a good restaurant, please?", "hint": "Question order + please."}, {"id": "ord2", "first": "Where", "words": ["is", "the", "washroom,", "please?"], "target": "Where is the washroom, please?", "hint": "Where is…"}, {"id": "ord3", "first": "I’d", "words": ["like", "a", "quiet", "room,", "please."], "target": "I’d like a quiet room, please.", "hint": "I’d like…"}];
  const BANK_TASKS = [{"id": "bank1", "template": ["Is", "breakfast", "____", "?"], "bank": ["included", "include", "including"], "target": "Is breakfast included?", "hint": "Included = part of the price."}, {"id": "bank2", "template": ["The", "washroom", "is", "____", "the", "café", "."], "bank": ["next to", "next", "near"], "target": "The washroom is next to the café.", "hint": "Next to = à côté de."}, {"id": "bank3", "template": ["This", "hotel", "is", "____", "than", "that", "one", "."], "bank": ["cheaper", "cheapest", "more cheap"], "target": "This hotel is cheaper than that one.", "hint": "Cheaper than…"}];
  const SORT_TASK = {"id": "sort1", "prompt": "Sort the items into the correct category.", "cats": [{"id": "preps", "label": "Prepositions (where?)"}, {"id": "verbs", "label": "Direction verbs (what to do?)"}], "items": [{"t": "next to", "cat": "preps"}, {"t": "across from", "cat": "preps"}, {"t": "between", "cat": "preps"}, {"t": "go straight", "cat": "verbs"}, {"t": "turn left", "cat": "verbs"}, {"t": "take the second right", "cat": "verbs"}], "hint": "Prepositions = position. Verbs = actions."};
  const LISTENING = [{"id": "lis1", "title": "Hotel check‑in (reservation + breakfast)", "lines": [{"who": "Reception", "side": "a", "say": "Hello. Welcome! Do you have a reservation?"}, {"who": "Karine", "side": "b", "say": "Yes. I have a reservation under Karine Cormier."}, {"who": "Reception", "side": "a", "say": "Great. It’s for two nights. Is breakfast included in your booking?"}, {"who": "Karine", "side": "b", "say": "Is breakfast included? If not, how much is it, please?"}]}, {"id": "lis2", "title": "Museum tickets (fee, rate, included)", "lines": [{"who": "Staff", "side": "a", "say": "Hello. Tickets are eighteen dollars. The audio guide is included."}, {"who": "Karine", "side": "b", "say": "Thank you. Is there a booking fee? What is the student rate?"}, {"who": "Staff", "side": "a", "say": "No booking fee. Student tickets are twelve dollars."}]}, {"id": "lis3", "title": "Directions (washroom + café)", "lines": [{"who": "Karine", "side": "b", "say": "Excuse me, where is the washroom, please?"}, {"who": "Local", "side": "a", "say": "Go straight for one block, then turn left. It’s next to the café."}, {"who": "Karine", "side": "b", "say": "Great, thank you!"}]}, {"id": "lis4", "title": "Restaurant (order + bottled water)", "lines": [{"who": "Server", "side": "a", "say": "Hello. Would you like still or sparkling water?"}, {"who": "Karine", "side": "b", "say": "Still water, please. Is bottled water included or extra?"}, {"who": "Server", "side": "a", "say": "It’s extra. Would you like a coffee as well?"}, {"who": "Karine", "side": "b", "say": "Yes, please. Could I have a coffee and the bill, please?"}]}];

  // ---------- Vocab ----------
  const V = { cat:"All", revealed:new Set() };

  function vocabCats(){
    const cats=Array.from(new Set(VOCAB.map(x=>x.cat))).sort();
    return ["All"].concat(cats);
  }
  function renderVocab(){
    const sel=$("#vCat");
    sel.innerHTML = vocabCats().map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
    sel.value=V.cat;
    sel.addEventListener("change", ()=>{ V.cat=sel.value; renderVGrid(); });
    renderVGrid();
  }
  function renderVGrid(){
    const grid=$("#vGrid");
    grid.innerHTML="";
    const list = (V.cat==="All") ? VOCAB : VOCAB.filter(x=>x.cat===V.cat);
    list.forEach((it)=>{
      const key = it.cat+"::"+it.w;
      const card=document.createElement("div");
      card.className="card vocabCard";
      const isOpen = V.revealed.has(key);
      card.innerHTML = `
        <div class="vocabTop">
          <div class="vocabWord">${esc(it.icon)} ${esc(it.w)}</div>
          <div class="vocabBtns">
            <button class="toolmini" data-act="speak">🔊</button>
            <button class="toolmini" data-act="toggle">${isOpen?"🙈 Hide":"👀 Reveal"}</button>
          </div>
        </div>
        <div class="kcard ${isOpen?"":"hidden"}" data-box="box">
          <div class="vocabDef"><strong>Meaning:</strong> ${esc(it.def)}</div>
          <div class="vocabFr"><strong>FR:</strong> ${esc(it.fr)}</div>
          <div class="vocabEx"><strong>Example:</strong> ${esc(it.ex)}</div>
        </div>
      `;
      const box=card.querySelector('[data-box="box"]');
      const btnT=card.querySelector('[data-act="toggle"]');
      attachTap(btnT, ()=>{
        const open = box.classList.contains("hidden");
        if(open){ box.classList.remove("hidden"); V.revealed.add(key); btnT.textContent="🙈 Hide"; }
        else { box.classList.add("hidden"); V.revealed.delete(key); btnT.textContent="👀 Reveal"; }
      });
      attachTap(card.querySelector('[data-act="speak"]'), ()=>TTS.say(it.w + ". " + it.ex));
      attachTap(card, (e)=>{
        const target = e?.target;
        if(target && (target.tagName==="BUTTON" || target.closest("button"))) return;
        btnT.click();
      });
      grid.appendChild(card);
    });
  }

  function startVocabQuiz(){
    const sample = shuffle(VOCAB).slice(0,5);
    const fb=$("#vFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add("ok");
    fb.innerHTML = "";

    const wrap=document.createElement("div");
    wrap.className="kcard";
    wrap.innerHTML = "<strong>Vocabulary Quick Quiz (5)</strong><div class='tiny' style='color:rgba(14,31,36,.72)'>Choose the best meaning.</div>";

    const meta = [];
    sample.forEach((it,i)=>{
      const choices = shuffle([it.def, "a suitcase", "a bathroom"]);
      const ans = choices.indexOf(it.def);
      meta.push({ans});
      wrap.innerHTML += `
        <div class="kcard" style="margin-top:.55rem">
          <div><strong>Q${i+1}:</strong> ${esc(it.w)}</div>
          ${choices.map((c,ci)=>`<label class="choice"><input type="radio" name="vq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")}
        </div>
      `;
    });

    wrap.innerHTML += `<div class="smallrow"><button class="btn" id="vqCheck" type="button">✅ Check</button><button class="btn btn--ghost" id="vqClose" type="button">✖ Close</button></div><div class="feedback hidden" id="vqFb"></div>`;
    fb.appendChild(wrap);

    attachTap($("#vqClose"), ()=>{ fb.classList.add("hidden"); fb.textContent=""; });

    attachTap($("#vqCheck"), ()=>{
      let correct=0;
      meta.forEach((m,i)=>{
        const c=document.querySelector(`input[name="vq${i}"]:checked`);
        if(c && parseInt(c.value,10)===m.ans) correct++;
      });
      const b=$("#vqFb");
      b.classList.remove("hidden","ok","no");
      b.classList.add(correct>=4?"ok":"no");
      b.textContent = `Score: ${correct}/5`;
      // award once
      Score.award("vocab_quiz", correct);
    });
  }

  // ---------- Grammar ----------
  function renderGrammar(){
    const grid=$("#gGrid");
    grid.innerHTML="";
    Object.keys(GRAMMAR).forEach((k)=>{
      const g=GRAMMAR[k];
      const card=document.createElement("div");
      card.className="card";
      card.innerHTML = `
        <h3>${esc(g.title)}</h3>
        <div class="kcard">
          <strong>Rule</strong><br/>
          ${g.rule.map(x=>"• "+esc(x)).join("<br/>")}
        </div>
        <div class="kcard" style="margin-top:.55rem">
          <strong>Examples</strong><br/>
          ${g.examples.map(x=>"• "+esc(x)).join("<br/>")}
        </div>
        <div class="smallrow">
          <button class="toolmini" data-act="listenRule">🔊 Listen rule</button>
          <button class="toolmini" data-act="listenEx">🔊 Listen examples</button>
        </div>
        <div class="tiny" style="color:rgba(14,31,36,.70)">${esc(g.note||"")}</div>
      `;
      attachTap(card.querySelector('[data-act="listenRule"]'), ()=>TTS.say(g.rule.join(". ")));
      attachTap(card.querySelector('[data-act="listenEx"]'), ()=>TTS.say(g.examples.join(". ")));
      grid.appendChild(card);
    });
  }

  // ---------- MCQ engine ----------
  const MCQState={ idx:0, order:[], current:null };
  function mcqRender(){
    const host=$("#mcqHost");
    const q=MCQState.current;
    if(!q){ host.textContent="Click Start."; return; }
    host.innerHTML = `<div><strong>${esc(q.prompt)}</strong></div>` + q.choices.map((c,i)=>`
      <label class="choice"><input type="radio" name="mcq" value="${i}"/><div>${esc(c)}</div></label>
    `).join("");
  }
  function mcqStart(){
    MCQState.order = shuffle(MCQ.map(x=>x.id));
    MCQState.idx=0;
    mcqNext(true);
  }
  function mcqNext(fromStart=false){
    if(!MCQState.order.length) return;
    if(!fromStart) MCQState.idx++;
    if(MCQState.idx >= MCQState.order.length) MCQState.idx = 0;
    MCQState.current = MCQ.find(x=>x.id===MCQState.order[MCQState.idx]);
    $("#mcqFb").classList.add("hidden");
    mcqRender();
  }
  function mcqHint(){
    const q=MCQState.current; if(!q) return;
    const fb=$("#mcqFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+q.hint;
  }
  function mcqCheck(){
    const q=MCQState.current; if(!q) return;
    const c=document.querySelector('input[name="mcq"]:checked');
    const fb=$("#mcqFb");
    if(!c){ fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="Choose an answer first."; return; }
    const ok = parseInt(c.value,10)===q.ans;
    fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent = ok ? "✅ Correct!" : "❌ Not quite.";
    if(ok) Score.award("mcq:"+q.id, 1);
  }
  function mcqReset(){
    MCQState.idx=0; MCQState.order=[]; MCQState.current=null;
    $("#mcqFb").classList.add("hidden"); $("#mcqHost").textContent="Click Start.";
  }

  // ---------- Dropdown engine ----------
  const DDState={ idx:0, order:[], current:null };
  function ddRender(){
    const host=$("#ddHost");
    const q=DDState.current;
    if(!q){ host.textContent="Click Start."; return; }
    host.innerHTML = `
      <div><strong>${esc(q.prompt)}</strong></div>
      <select class="select" id="ddSel">${q.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>
    `;
  }
  function ddStart(){
    DDState.order = shuffle(DROPDOWNS.map(x=>x.id));
    DDState.idx=0;
    ddNext(true);
  }
  function ddNext(fromStart=false){
    if(!DDState.order.length) return;
    if(!fromStart) DDState.idx++;
    if(DDState.idx >= DDState.order.length) DDState.idx=0;
    DDState.current = DROPDOWNS.find(x=>x.id===DDState.order[DDState.idx]);
    $("#ddFb").classList.add("hidden");
    ddRender();
  }
  function ddHint(){
    const q=DDState.current; if(!q) return;
    const fb=$("#ddFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+q.hint;
  }
  function ddCheck(){
    const q=DDState.current; if(!q) return;
    const sel=$("#ddSel"); const val=parseInt(sel.value,10);
    const ok = val===q.ans;
    const fb=$("#ddFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent = ok ? "✅ Correct!" : "❌ Not quite.";
    if(ok) Score.award("dd:"+q.id, 1);
  }
  function ddReset(){
    DDState.idx=0; DDState.order=[]; DDState.current=null;
    $("#ddFb").classList.add("hidden"); $("#ddHost").textContent="Click Start.";
  }

  // ---------- Order engine ----------
  const OrdState={ idx:0, order:[], current:null };
  function ordRender(){
    const host=$("#ordHost");
    const q=OrdState.current;
    if(!q){ host.textContent="Click Start."; return; }
    const words = shuffle(q.words.slice());
    host.innerHTML = `
      <div><strong>Build the sentence</strong></div>
      <div class="kcard"><strong>First word:</strong> ${esc(q.first)}</div>
      <div class="bank" id="ordBank"></div>
      <div class="zone" id="ordZone"></div>
      <div class="tiny" style="color:rgba(14,31,36,.70)">Tap words to add. Tap a word in the sentence to remove. (Drag also works on desktop.)</div>
    `;
    const bank=$("#ordBank"), zone=$("#ordZone");
    words.forEach(w=>{
      const t=document.createElement("span");
      t.className="token";
      t.textContent=w;
      t.dataset.word=w;
      t.draggable=true;
      attachTap(t, ()=>{
        if(t.classList.contains("is-used")) return;
        addToZone(t, zone);
      });
      t.addEventListener("dragstart", (e)=>{
        e.dataTransfer.setData("text/plain", w);
      });
      bank.appendChild(t);
    });
    zone.addEventListener("dragover", (e)=>e.preventDefault());
    zone.addEventListener("drop", (e)=>{
      e.preventDefault();
      const w=e.dataTransfer.getData("text/plain");
      const tok = Array.from(bank.querySelectorAll(".token")).find(x=>x.dataset.word===w && !x.classList.contains("is-used"));
      if(tok) addToZone(tok, zone);
    });

    function addToZone(tok, zoneEl){
      tok.classList.add("is-used");
      const c=tok.cloneNode(true);
      c.classList.remove("is-used");
      c.draggable=false;
      attachTap(c, ()=>{
        c.remove();
        tok.classList.remove("is-used");
      });
      zoneEl.appendChild(c);
    }
  }
  function ordStart(){
    OrdState.order=shuffle(ORDER_TASKS.map(x=>x.id));
    OrdState.idx=0;
    ordLoad(true);
  }
  function ordLoad(fromStart=false){
    if(!OrdState.order.length) return;
    if(!fromStart) OrdState.idx++;
    if(OrdState.idx>=OrdState.order.length) OrdState.idx=0;
    OrdState.current = ORDER_TASKS.find(x=>x.id===OrdState.order[OrdState.idx]);
    $("#ordFb").classList.add("hidden");
    ordRender();
  }
  function ordHint(){
    const q=OrdState.current; if(!q) return;
    const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+q.hint;
  }
  function ordCheck(){
    const q=OrdState.current; if(!q) return;
    const zone=$("#ordZone");
    const built=[q.first].concat($$(".token", zone).map(t=>t.textContent.trim())).join(" ")
      .replace(/\s+/g," ").trim().replace(/\s+([,?.!])/g,"$1");
    const ok = norm(built)===norm(q.target);
    const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent = ok ? "✅ Correct!" : ("❌ Not quite. You wrote: " + built);
    if(ok) Score.award("ord:"+q.id, 2);
  }
  function ordReset(){
    OrdState.idx=0; OrdState.order=[]; OrdState.current=null;
    $("#ordHost").textContent="Click Start."; $("#ordFb").classList.add("hidden");
  }

  // ---------- Bank engine ----------
  const BankState={ idx:0, order:[], current:null };
  function bankRender(){
    const host=$("#bankHost");
    const q=BankState.current;
    if(!q){ host.textContent="Click Start."; return; }
    const bank=shuffle(q.bank.slice());
    host.innerHTML = `
      <div><strong>Fill the blanks</strong></div>
      <div class="kcard" id="bankSentence"></div>
      <div class="bank" id="bankWords"></div>
      <div class="tiny" style="color:rgba(14,31,36,.70)">Tap a word to fill the next blank.</div>
    `;
    const sent=$("#bankSentence"), words=$("#bankWords");
    let blankCount=0;
    sent.innerHTML = q.template.map(x=> x==="____" ? `<strong><span class="badge" data-blank="${++blankCount}">____</span></strong>` : esc(x)).join(" ");
    bank.forEach(w=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=w;
      attachTap(t, ()=>{
        const next = Array.from(sent.querySelectorAll("[data-blank]")).find(b=>b.textContent==="____");
        if(!next) return;
        next.textContent=w;
        t.classList.add("is-used");
      });
      words.appendChild(t);
    });
  }
  function bankStart(){
    BankState.order=shuffle(BANK_TASKS.map(x=>x.id));
    BankState.idx=0;
    bankLoad(true);
  }
  function bankLoad(fromStart=false){
    if(!BankState.order.length) return;
    if(!fromStart) BankState.idx++;
    if(BankState.idx>=BankState.order.length) BankState.idx=0;
    BankState.current = BANK_TASKS.find(x=>x.id===BankState.order[BankState.idx]);
    $("#bankFb").classList.add("hidden");
    bankRender();
  }
  function bankHint(){
    const q=BankState.current; if(!q) return;
    const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+q.hint;
  }
  function bankCheck(){
    const q=BankState.current; if(!q) return;
    const sent=$("#bankSentence");
    const built = sent.textContent.replace(/\s+/g," ").trim();
    const ok = norm(built)===norm(q.target);
    const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent = ok ? "✅ Correct!" : ("❌ Not quite. You wrote: " + built);
    if(ok) Score.award("bank:"+q.id, 2);
  }
  function bankReset(){
    BankState.idx=0; BankState.order=[]; BankState.current=null;
    $("#bankHost").textContent="Click Start."; $("#bankFb").classList.add("hidden");
  }

  // ---------- Sorting ----------
  function sortRender(){
    const host=$("#sortHost");
    host.innerHTML = `
      <div><strong>${esc(SORT_TASK.prompt)}</strong></div>
      <div class="smallrow" style="margin-top:.45rem">
        <div class="bank" id="sortBank"></div>
      </div>
      <div class="grid2" style="margin-top:.55rem">
        ${SORT_TASK.cats.map(c=>`<div class="kcard"><strong>${esc(c.label)}</strong><div class="zone" data-cat="${esc(c.id)}" style="margin-top:.45rem"></div></div>`).join("")}
      </div>
      <div class="tiny" style="color:rgba(14,31,36,.70);margin-top:.45rem">Tap OR drag items into boxes.</div>
    `;
    const bank=$("#sortBank");
    const zones=$$("[data-cat]", host);
    const items=shuffle(SORT_TASK.items.slice());
    items.forEach(it=>{
      const t=document.createElement("span");
      t.className="token";
      t.textContent=it.t;
      t.dataset.answer=it.cat;
      t.draggable=true;
      attachTap(t, ()=>{
        const z = zones.find(x=>x.dataset.cat===it.cat);
        if(z) z.appendChild(t);
      });
      t.addEventListener("dragstart", (e)=>{
        e.dataTransfer.setData("text/plain", it.t);
      });
      bank.appendChild(t);
    });
    zones.forEach(z=>{
      z.addEventListener("dragover", (e)=>e.preventDefault());
      z.addEventListener("drop", (e)=>{
        e.preventDefault();
        const txt=e.dataTransfer.getData("text/plain");
        const tok = Array.from(host.querySelectorAll(".token")).find(x=>x.textContent===txt);
        if(tok) z.appendChild(tok);
      });
    });
  }
  function sortHint(){
    const fb=$("#sortFb");
    fb.classList.remove("hidden","ok","no");
    fb.classList.add("no");
    fb.textContent="💡 "+SORT_TASK.hint;
  }
  function sortCheck(){
    const host=$("#sortHost");
    const zones=$$("[data-cat]", host);
    let total=0, correct=0;
    zones.forEach(z=>{
      const cat=z.dataset.cat;
      const toks=$$(".token", z);
      toks.forEach(t=>{
        total++;
        if(t.dataset.answer===cat) correct++;
      });
    });
    const fb=$("#sortFb");
    fb.classList.remove("hidden","ok","no");
    const ok = total===SORT_TASK.items.length && correct===total;
    fb.classList.add(ok?"ok":"no");
    fb.textContent = ok ? "✅ Perfect!" : `Score: ${correct}/${SORT_TASK.items.length}. (Make sure all items are placed.)`;
    if(ok) Score.award("sort:"+SORT_TASK.id, 3);
  }
  function sortReset(){
    $("#sortFb").classList.add("hidden");
    sortRender();
  }

  // ---------- Listening ----------
  const Lis = { current:null, showText:false };

  function renderLisPicker(){
    const sel=$("#lisPick");
    sel.innerHTML = LISTENING.map(d=>`<option value="${esc(d.id)}">${esc(d.title)}</option>`).join("");
    sel.addEventListener("change", ()=>loadDialogue(sel.value));
    loadDialogue(sel.value || LISTENING[0].id);
  }
  function loadDialogue(id){
    const d=LISTENING.find(x=>x.id===id);
    Lis.current=d;
    Lis.showText=false;
    renderDialogue();
    buildLisQuestions();
    $("#lisQFb").classList.add("hidden");
  }
  function renderDialogue(){
    const d=Lis.current;
    const stream=$("#lisStream");
    stream.innerHTML="";
    d.lines.forEach((ln)=>{
      const b=document.createElement("div");
      b.className="bubble "+(ln.side==="a"?"a":"b");
      b.innerHTML = `
        <div class="who">${ln.side==="a"?"🟦":"🟩"} ${esc(ln.who)}</div>
        <div class="txt">${Lis.showText ? esc(ln.say) : "<span class='badge'>Hidden</span>"}</div>
        <div class="tools"><button class="toolmini" data-act="speak">🔊 Listen</button></div>
      `;
      attachTap(b.querySelector('[data-act="speak"]'), ()=>TTS.say(ln.say));
      stream.appendChild(b);
    });
  }
  function lisPlayAll(){
    const d=Lis.current;
    let i=0;
    const speakNext=()=>{
      if(i>=d.lines.length) return;
      TTS.say(d.lines[i].say);
      i++;
      setTimeout(speakNext, 1600);
    };
    speakNext();
  }
  function lisShow(){ Lis.showText=true; renderDialogue(); }
  function lisHide(){ Lis.showText=false; renderDialogue(); }

  function buildLisQuestions(){
    const d=Lis.current;
    const host=$("#lisQHost");
    const qset = [];
    if(d.id==="lis1"){
      qset.push({p:"Does Karine have a reservation?",c:["Yes","No"],a:0,h:"She says: I have a reservation."});
      qset.push({p:"How many nights?",c:["One","Two","Three"],a:1,h:"Reception says: two nights."});
      qset.push({p:"What does Karine ask about?",c:["Breakfast","Parking","A refund"],a:0,h:"She asks: Is breakfast included?"});
      qset.push({p:"Choose the polite sentence:",c:["Could you repeat that, please?","Repeat!","Repeat."],a:0,h:"Could you… please?"});
      qset.push({p:"Check‑in is…",c:["arrival time","departure time"],a:0,h:"Check‑in = arrival."});
    } else if(d.id==="lis2"){
      qset.push({p:"Is the audio guide included?",c:["Yes","No"],a:0,h:"Staff says included."});
      qset.push({p:"Is there a booking fee?",c:["Yes","No"],a:1,h:"No booking fee."});
      qset.push({p:"Student tickets are…",c:["$12","$18","$20"],a:0,h:"Twelve dollars."});
      qset.push({p:"Rate = …",c:["price level","bathroom","parking"],a:0,h:"Rate = tarif."});
      qset.push({p:"Best question:",c:["What is the student rate?","Student rate what?"],a:0,h:"Word order."});
    } else if(d.id==="lis3"){
      qset.push({p:"Karine asks for…",c:["washroom","menu","ticket"],a:0,h:"Where is the washroom?"});
      qset.push({p:"First…",c:["go straight","turn right","stop"],a:0,h:"Go straight."});
      qset.push({p:"Then…",c:["turn left","pay","sit"],a:0,h:"Turn left."});
      qset.push({p:"The washroom is…",c:["next to the café","in the hotel"],a:0,h:"Next to the café."});
      qset.push({p:"Polite opener:",c:["Excuse me, … please?","Hey!"],a:0,h:"Excuse me…" });
    } else {
      qset.push({p:"What water does Karine want?",c:["still","sparkling"],a:0,h:"Still water."});
      qset.push({p:"Bottled water is…",c:["included","extra"],a:1,h:"It’s extra."});
      qset.push({p:"Karine also wants…",c:["a coffee","a ticket"],a:0,h:"Coffee."});
      qset.push({p:"She asks for…",c:["the bill","a map"],a:0,h:"The bill/check."});
      qset.push({p:"Most polite:",c:["Could I have the bill, please?","Bill now."],a:0,h:"Could I have…" });
    }

    host.innerHTML = qset.map((q,i)=>`
      <div class="kcard" style="margin-top:.55rem">
        <div><strong>Q${i+1}:</strong> ${esc(q.p)}</div>
        ${q.c.map((c,ci)=>`<label class="choice"><input type="radio" name="lq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")}
      </div>
    `).join("");
    host.dataset.qset = JSON.stringify(qset);
  }

  function lisResetQ(){ buildLisQuestions(); $("#lisQFb").classList.add("hidden"); }
  function lisCheckQ(){
    const host=$("#lisQHost");
    const qset=JSON.parse(host.dataset.qset || "[]");
    let correct=0;
    qset.forEach((q,i)=>{
      const c=document.querySelector(`input[name="lq${i}"]:checked`);
      if(c && parseInt(c.value,10)===q.a) correct++;
    });
    const fb=$("#lisQFb");
    fb.classList.remove("hidden","ok","no");
    const ok = correct>=4;
    fb.classList.add(ok?"ok":"no");
    fb.textContent = `Score: ${correct}/5`;
    if(ok) Score.award("listening:"+Lis.current.id, 4);
  }

  // ---------- Final quiz ----------
  const Final={ idx:0, bank:[], current:null };

  function buildFinalBank(){
    const bank=[];
    shuffle(MCQ).slice(0,10).forEach(q=>bank.push({type:"mcq", q}));
    shuffle(DROPDOWNS).slice(0,5).forEach(q=>bank.push({type:"dd", q}));
    shuffle(BANK_TASKS).slice(0,3).forEach(q=>bank.push({type:"bank", q}));
    shuffle(ORDER_TASKS).slice(0,2).forEach(q=>bank.push({type:"order", q}));
    return shuffle(bank).slice(0,20);
  }

  function finalRender(){
    const host=$("#finalHost");
    const item=Final.current;
    if(!item){ host.textContent="Click Start."; return; }
    $("#finalFb").classList.add("hidden");
    const n=Final.idx+1;

    if(item.type==="mcq"){
      const q=item.q;
      host.innerHTML = `<div class="badge">Question ${n}/20</div><div style="margin-top:.35rem"><strong>${esc(q.prompt)}</strong></div>` +
        q.choices.map((c,i)=>`<label class="choice"><input type="radio" name="fmcq" value="${i}"/><div>${esc(c)}</div></label>`).join("");
    } else if(item.type==="dd"){
      const q=item.q;
      host.innerHTML = `<div class="badge">Question ${n}/20</div><div style="margin-top:.35rem"><strong>${esc(q.prompt)}</strong></div>
        <select class="select" id="fddSel">${q.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>`;
    } else if(item.type==="bank"){
      const q=item.q;
      const bank=shuffle(q.bank.slice());
      host.innerHTML = `<div class="badge">Question ${n}/20</div><div style="margin-top:.35rem"><strong>Fill the blanks</strong></div>
        <div class="kcard" id="fBankSent"></div><div class="bank" id="fBankWords"></div>`;
      const sent=$("#fBankSent"), words=$("#fBankWords");
      let blankCount=0;
      sent.innerHTML = q.template.map(x=> x==="____" ? `<strong><span class="badge" data-blank="${++blankCount}">____</span></strong>` : esc(x)).join(" ");
      bank.forEach(w=>{
        const t=document.createElement("span"); t.className="token"; t.textContent=w;
        attachTap(t, ()=>{
          const next = Array.from(sent.querySelectorAll("[data-blank]")).find(b=>b.textContent==="____");
          if(!next) return;
          next.textContent=w;
          t.classList.add("is-used");
        });
        words.appendChild(t);
      });
    } else {
      const q=item.q;
      const words=shuffle(q.words.slice());
      host.innerHTML = `<div class="badge">Question ${n}/20</div><div style="margin-top:.35rem"><strong>Build the sentence</strong></div>
        <div class="kcard"><strong>First word:</strong> ${esc(q.first)}</div>
        <div class="bank" id="fOrdBank"></div><div class="zone" id="fOrdZone"></div>`;
      const bank=$("#fOrdBank"), zone=$("#fOrdZone");
      words.forEach(w=>{
        const t=document.createElement("span"); t.className="token"; t.textContent=w;
        attachTap(t, ()=>{
          if(t.classList.contains("is-used")) return;
          t.classList.add("is-used");
          const c=t.cloneNode(true); c.classList.remove("is-used");
          attachTap(c, ()=>{ c.remove(); t.classList.remove("is-used"); });
          zone.appendChild(c);
        });
        bank.appendChild(t);
      });
    }
  }

  function finalStart(){
    Final.bank = buildFinalBank();
    Final.idx = 0;
    Final.current = Final.bank[0];
    finalRender();
  }

  function finalHint(){
    const fb=$("#finalFb");
    const item=Final.current; if(!item) return;
    const hint = item.type==="mcq" ? item.q.hint :
                 item.type==="dd" ? item.q.hint :
                 item.type==="bank" ? item.q.hint :
                 item.q.hint;
    fb.classList.remove("hidden","ok","no");
    fb.classList.add("no");
    fb.textContent="💡 "+hint;
  }

  function finalGetAnswer(){
    const item=Final.current;
    if(item.type==="mcq"){
      const c=document.querySelector('input[name="fmcq"]:checked');
      return c ? parseInt(c.value,10) : null;
    }
    if(item.type==="dd"){
      const sel=$("#fddSel");
      return sel ? parseInt(sel.value,10) : null;
    }
    if(item.type==="bank"){
      return $("#fBankSent").textContent.replace(/\s+/g," ").trim();
    }
    const q=item.q;
    const built=[q.first].concat($$(".token", $("#fOrdZone")).map(t=>t.textContent.trim())).join(" ")
      .replace(/\s+/g," ").trim().replace(/\s+([,?.!])/g,"$1");
    return built;
  }

  function finalCheck(){
    const item=Final.current; if(!item) return;
    const fb=$("#finalFb");
    const ans=finalGetAnswer();
    let ok=false;
    if(item.type==="mcq") ok=(ans!==null && ans===item.q.ans);
    else if(item.type==="dd") ok=(ans!==null && ans===item.q.ans);
    else if(item.type==="bank") ok=(norm(ans)===norm(item.q.target));
    else ok=(norm(ans)===norm(item.q.target));

    fb.classList.remove("hidden","ok","no");
    fb.classList.add(ok?"ok":"no");
    fb.textContent = ok ? "✅ Correct!" : "❌ Not quite.";
    if(ok) Score.award("final:"+Final.idx, 1);
  }

  function finalNext(){
    if(!Final.bank.length) return;
    Final.idx++;
    if(Final.idx>=Final.bank.length) Final.idx=0;
    Final.current = Final.bank[Final.idx];
    finalRender();
  }

  function finalReset(){
    Final.idx=0; Final.bank=[]; Final.current=null;
    $("#finalHost").textContent="Click Start.";
    $("#finalFb").classList.add("hidden");
  }

  // ---------- Reset all ----------
  function resetAll(){
    TTS.stop();
    Score.reset();
    V.revealed.clear();
    V.cat="All";
    $("#vFb").classList.add("hidden");
    mcqReset(); ddReset(); ordReset(); bankReset();
    sortReset();
    loadDialogue(LISTENING[0].id);
    finalReset();
    renderVocab();
    renderGrammar();
    $("#top").scrollIntoView({behavior:"smooth"});
  }

  // ---------- Init ----------
  async function init(){
    // Score max (rough)
    Score.setMax(5 + 5 + (ORDER_TASKS.length*2) + (BANK_TASKS.length*2) + 3 + (LISTENING.length*4) + 20);

    await rebuildVoiceSelect();
    syncAccentButtons();
    syncAutoButtons();

    attachTap($("#voiceUS"), ()=>{ TTS.setLang("en-US"); syncAccentButtons(); rebuildVoiceSelect(); testVoice(); });
    attachTap($("#voiceUK"), ()=>{ TTS.setLang("en-GB"); syncAccentButtons(); rebuildVoiceSelect(); testVoice(); });

    $("#voiceSelect").addEventListener("change", (e)=>{ TTS.setVoiceName(e.target.value); testVoice(); });

    attachTap($("#autoOff"), ()=>{ TTS.setAuto(false); syncAutoButtons(); });
    attachTap($("#autoOn"), ()=>{ TTS.setAuto(true); syncAutoButtons(); });

    attachTap($("#btnTestVoice"), ()=>testVoice());
    attachTap($("#btnStop"), ()=>TTS.stop());

    attachTap($("#btnStart"), ()=>$("#secVocab").scrollIntoView({behavior:"smooth"}));
    attachTap($("#btnHow"), ()=>alert("How to use:\n\n1) Choose US or UK accent (top bar). Optionally choose a specific voice.\n2) Review Vocabulary (tap cards + listen).\n3) Read Grammar rules + listen to examples.\n4) Do Exercise Lab: MCQ, dropdown, sentence builder, word bank, sorting.\n5) Do Listening dialogues + comprehension.\n6) Finish with Final Quiz (goal 16/20)."));

    attachTap($("#btnResetAll"), ()=>{ if(confirm("Reset the whole page?")) resetAll(); });

    // Vocab buttons
    attachTap($("#btnVRevealAll"), ()=>{ 
      VOCAB.forEach(it=>V.revealed.add(it.cat+"::"+it.w));
      renderVGrid();
    });
    attachTap($("#btnVHideAll"), ()=>{ V.revealed.clear(); renderVGrid(); });
    attachTap($("#btnVQuiz"), ()=>startVocabQuiz());

    // Render
    renderVocab();
    renderGrammar();

    // MCQ controls
    attachTap($("#mcqStart"), ()=>mcqStart());
    attachTap($("#mcqCheck"), ()=>mcqCheck());
    attachTap($("#mcqNext"), ()=>mcqNext(false));
    attachTap($("#mcqHint"), ()=>mcqHint());
    attachTap($("#mcqReset"), ()=>mcqReset());

    // Dropdown controls
    attachTap($("#ddStart"), ()=>ddStart());
    attachTap($("#ddCheck"), ()=>ddCheck());
    attachTap($("#ddNext"), ()=>ddNext(false));
    attachTap($("#ddHint"), ()=>ddHint());
    attachTap($("#ddReset"), ()=>ddReset());

    // Order controls
    attachTap($("#ordStart"), ()=>ordStart());
    attachTap($("#ordCheck"), ()=>ordCheck());
    attachTap($("#ordHint"), ()=>ordHint());
    attachTap($("#ordReset"), ()=>ordReset());

    // Bank controls
    attachTap($("#bankStart"), ()=>bankStart());
    attachTap($("#bankCheck"), ()=>bankCheck());
    attachTap($("#bankHint"), ()=>bankHint());
    attachTap($("#bankReset"), ()=>bankReset());

    // Sorting
    sortRender();
    attachTap($("#sortCheck"), ()=>sortCheck());
    attachTap($("#sortHint"), ()=>sortHint());
    attachTap($("#sortReset"), ()=>sortReset());

    // Listening
    renderLisPicker();
    attachTap($("#lisPlayAll"), ()=>lisPlayAll());
    attachTap($("#lisShow"), ()=>lisShow());
    attachTap($("#lisHide"), ()=>lisHide());
    attachTap($("#lisCheck"), ()=>lisCheckQ());
    attachTap($("#lisReset"), ()=>lisResetQ());

    // Final
    attachTap($("#finalStart"), ()=>finalStart());
    attachTap($("#finalCheck"), ()=>finalCheck());
    attachTap($("#finalNext"), ()=>finalNext());
    attachTap($("#finalHint"), ()=>finalHint());
    attachTap($("#finalReset"), ()=>finalReset());

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  init();

  // Listening helper
  function loadDialogue(id){
    const d=LISTENING.find(x=>x.id===id);
    Lis.current=d;
    Lis.showText=false;
    renderDialogue();
    buildLisQuestions();
    $("#lisQFb").classList.add("hidden");
  }
})();
