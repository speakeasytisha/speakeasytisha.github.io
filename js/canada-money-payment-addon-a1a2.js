/* SpeakEasyTisha — Canada Money & Paying Addon (A1/A2)
Build: 20260520-115854
*/
(() => {
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const DEBUG = $("#debugBox");
  const log=(m)=>{ try{DEBUG.classList.remove("hidden"); DEBUG.textContent += "\n"+m;}catch(e){} };
  window.addEventListener("error",(e)=>log("[Error] "+e.message+" @ "+e.filename+":"+e.lineno));
  window.addEventListener("unhandledrejection",(e)=>log("[Promise] "+String(e.reason)));

  const esc=(s)=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const norm=(s)=>String(s??"").replace(/[’]/g,"'").replace(/[‐‑–—]/g,"-").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim().toLowerCase();
  const shuffle=(a)=>{a=(a||[]).slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
  const tap=(el, fn)=>{ if(!el) return; let last=0;
    const h=(e)=>{const now=Date.now(); if(now-last<320) return; last=now; try{fn(e);}catch(err){console.error(err); log(String(err));}};
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h);} else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  };

  const PROVINCES=[{"id": "on", "name": "Ontario", "tax": "HST (harmonized sales tax)"}, {"id": "qc", "name": "Quebec", "tax": "GST + QST (two-part sales tax)"}, {"id": "bc", "name": "British Columbia", "tax": "GST + PST (two-part sales tax)"}, {"id": "ab", "name": "Alberta", "tax": "GST (federal sales tax only)"}];
  const VOCAB=[{"cat": "Paying basics", "icon": "💳", "w": "pay by card", "fr": "payer par carte", "def": "use a bank card to pay", "ex": "Can I pay by card?"}, {"cat": "Paying basics", "icon": "💵", "w": "pay in cash", "fr": "payer en espèces", "def": "pay with banknotes/coins", "ex": "I’ll pay in cash, please."}, {"cat": "Paying basics", "icon": "🧾", "w": "receipt", "fr": "reçu", "def": "proof of payment", "ex": "Could I have the receipt, please?"}, {"cat": "Paying basics", "icon": "💰", "w": "total", "fr": "total", "def": "final amount to pay", "ex": "What’s the total, please?"}, {"cat": "Paying basics", "icon": "➕", "w": "tax", "fr": "taxe", "def": "money added to the price", "ex": "Is tax included?"}, {"cat": "Paying basics", "icon": "🏷️", "w": "price", "fr": "prix", "def": "cost of something", "ex": "What’s the price?"}, {"cat": "Paying basics", "icon": "🔁", "w": "refund", "fr": "remboursement", "def": "money returned", "ex": "Can I get a refund?"}, {"cat": "Card words", "icon": "🔢", "w": "PIN", "fr": "code PIN", "def": "secret number for your card", "ex": "Please enter your PIN."}, {"cat": "Card words", "icon": "📡", "w": "contactless", "fr": "sans contact", "def": "tap to pay", "ex": "You can pay contactless."}, {"cat": "Card words", "icon": "✅", "w": "approved", "fr": "accepté", "def": "payment accepted", "ex": "Great — it’s approved."}, {"cat": "Card words", "icon": "❌", "w": "declined", "fr": "refusé", "def": "payment not accepted", "ex": "Sorry, it’s declined."}, {"cat": "Useful questions", "icon": "❓", "w": "Is tax included?", "fr": "La taxe est incluse ?", "def": "ask if tax is included", "ex": "Is tax included in the price?"}, {"cat": "Useful questions", "icon": "❓", "w": "What’s the total after tax?", "fr": "Quel est le total TTC ?", "def": "final price with tax", "ex": "What’s the total after tax?"}, {"cat": "Useful questions", "icon": "❓", "w": "Do you take Visa?", "fr": "Vous prenez Visa ?", "def": "check accepted cards", "ex": "Do you take Visa?"}, {"cat": "Useful questions", "icon": "❓", "w": "Can we pay separately?", "fr": "Peut‑on payer séparément ?", "def": "split the bill", "ex": "Can we pay separately?"}];
  const GRAMMAR={"polite": {"title": "Polite payment requests", "rule": ["Can I…? (neutral): Can I pay by card?", "Could I…? (more polite): Could I have the receipt, please?", "I’d like… (polite): I’d like to pay, please."], "examples": ["Could I have the receipt, please?", "I’d like to pay by card, please."], "note": "Short add-ons: please / thank you / excuse me."}, "tax": {"title": "Tax & totals (the key phrases)", "rule": ["Is tax included? (TTC?)", "What’s the total after tax?", "How much is the tax?"], "examples": ["Is tax included in the price?", "What’s the total after tax, please?"], "note": "Tax type depends on the province. You can still ask these questions anywhere."}, "problems": {"title": "If the card is declined (calm + solution)", "rule": ["My card was declined.", "Can I try again, please?", "Can I pay in cash?"], "examples": ["Sorry — it didn’t work. Can I try again?", "My card was declined. Can I pay in cash?"], "note": "Keep it calm + ask for the next step."}};
  const MCQ=[{"id": "m1", "prompt": "Most polite:", "choices": ["Give me the receipt.", "Could I have the receipt, please?", "I want the receipt."], "ans": 1, "hint": "Could I…? + please"}, {"id": "m2", "prompt": "Best question:", "choices": ["Is tax include?", "Is tax included?", "Is tax including?"], "ans": 1, "hint": "included"}, {"id": "m3", "prompt": "Best:", "choices": ["Can I pay by card?", "Can I pay of card?", "Can I pay from card?"], "ans": 0, "hint": "pay by card"}, {"id": "m4", "prompt": "Card problem:", "choices": ["My card was declined.", "My card is decline.", "My card has declined."], "ans": 0, "hint": "was declined"}, {"id": "m5", "prompt": "Best:", "choices": ["What’s the total after tax?", "What’s total after tax?", "What total after tax?"], "ans": 0, "hint": "What’s the…"}, {"id": "m6", "prompt": "Split bill:", "choices": ["Can we pay separately?", "Can we pay separate?", "Pay separately we?"], "ans": 0, "hint": "separately"}];
  const DROPDOWNS=[{"id": "d1", "prompt": "Complete: Could I have the ___ , please?", "opts": ["receipt", "recipe", "receive"], "ans": 0, "hint": "receipt"}, {"id": "d2", "prompt": "Complete: What’s the total after ___ ?", "opts": ["tax", "task", "text"], "ans": 0, "hint": "tax"}, {"id": "d3", "prompt": "Complete: Please enter your ___ .", "opts": ["PIN", "pen", "pan"], "ans": 0, "hint": "PIN"}, {"id": "d4", "prompt": "Complete: My card was ___ .", "opts": ["declined", "decline", "declining"], "ans": 0, "hint": "declined"}];
  const ORDER_TASKS=[{"id": "o1", "first": "Could", "words": ["I", "have", "the", "receipt", ",", "please", "?"], "target": "Could I have the receipt, please?", "hint": "Could I have…"}, {"id": "o2", "first": "Is", "words": ["tax", "included", "in", "the", "price", "?"], "target": "Is tax included in the price?", "hint": "included"}, {"id": "o3", "first": "What’s", "words": ["the", "total", "after", "tax", "?"], "target": "What’s the total after tax?", "hint": "after tax"}];
  const BANK_TASKS=[{"id": "b1", "template": ["Can", "I", "pay", "by", "____", "?"], "bank": ["card", "cash", "receipt"], "target": "Can I pay by card?", "hint": "card"}, {"id": "b2", "template": ["Could", "I", "have", "the", "____", ",", "please", "?"], "bank": ["receipt", "tax", "total"], "target": "Could I have the receipt, please?", "hint": "receipt"}, {"id": "b3", "template": ["What’s", "the", "total", "after", "____", "?"], "bank": ["tax", "pin", "tip"], "target": "What’s the total after tax?", "hint": "tax"}, {"id": "b4", "template": ["My", "card", "was", "____", ".", "Can", "I", "pay", "in", "cash", "?"], "bank": ["declined", "included", "approved"], "target": "My card was declined. Can I pay in cash?", "hint": "declined"}];
  const SORT_TASK={"id": "s1", "prompt": "Sort: Questions vs Problems/Solutions", "cats": [{"id": "q", "label": "Questions"}, {"id": "p", "label": "Problems / Solutions"}], "items": [{"t": "Is tax included?", "cat": "q"}, {"t": "What’s the total after tax?", "cat": "q"}, {"t": "Do you take Visa?", "cat": "q"}, {"t": "Can we pay separately?", "cat": "q"}, {"t": "My card was declined.", "cat": "p"}, {"t": "Can I try again, please?", "cat": "p"}, {"t": "Can I pay in cash?", "cat": "p"}, {"t": "Could you help me, please?", "cat": "p"}], "hint": "Questions ask for information. Problems ask for a solution."};
  const TRAIN={"easy": [{"id": "te1", "p": "Choose: ___ I pay by card?", "choices": ["Can", "Do", "Is"], "a": 0, "h": "Can I…?"}, {"id": "te2", "p": "Choose: total after ___", "choices": ["tax", "task", "text"], "a": 0, "h": "tax"}, {"id": "te3", "p": "Choose: Could I have the ___ ?", "choices": ["receipt", "recipe", "receive"], "a": 0, "h": "receipt"}], "medium": [{"id": "tm1", "p": "Best: split bill", "choices": ["Can we pay separately?", "Can we pay separate?", "We pay separately?"], "a": 0, "h": "separately"}, {"id": "tm2", "p": "Best: declined", "choices": ["My card was declined.", "My card is decline.", "My card has decline."], "a": 0, "h": "was declined"}], "hard": [{"id": "th1", "p": "Best sequence at checkout:", "choices": ["Total after tax → pay by card → receipt", "Receipt → tax → total", "Pay → receipt → hello"], "a": 0, "h": "natural order"}]};
  const LISTENING=[{"id": "l1", "title": "Café: card + receipt", "lines": [{"who": "Server", "side": "a", "say": "Would you like to pay by card or cash?"}, {"who": "Traveler", "side": "b", "say": "By card, please."}, {"who": "Server", "side": "a", "say": "Please tap your card or enter your PIN."}, {"who": "Traveler", "side": "b", "say": "Could I have the receipt, please?"}]}, {"id": "l2", "title": "Shop: tax + total after tax", "lines": [{"who": "Cashier", "side": "a", "say": "That’s twenty dollars."}, {"who": "Traveler", "side": "b", "say": "Is tax included in the price?"}, {"who": "Cashier", "side": "a", "say": "No, tax is added. The total after tax is twenty-two dollars."}, {"who": "Traveler", "side": "b", "say": "Okay. I’ll pay by card, please."}]}];
  const LQ={"l1": [["How does the traveler pay?", "By card", "By cash", "Not mentioned", 0], ["The traveler asks for…", "a receipt", "a refund", "a discount", 0], ["PIN is…", "a secret number", "a tax", "a receipt", 0], ["Server says…", "tap your card", "take the bus", "open the door", 0], ["The phrase is…", "pay by card", "pay of card", "pay from card", 0]], "l2": [["Is tax included?", "No", "Yes", "Not mentioned", 0], ["Total after tax is…", "22 dollars", "20 dollars", "12 dollars", 0], ["Cashier says…", "tax is added", "tax is free", "tax is removed", 0], ["Traveler will pay…", "by card", "by cash", "tomorrow", 0], ["After tax means…", "final price", "before tax", "discount", 0]]};
  const BUILDER={"title": "Payment Script Builder (A1 → A2/B1)", "steps": [{"label": "1) Place", "opts": ["café", "shop", "ticket office", "hotel"]}, {"label": "2) Start", "opts": ["Excuse me.", "Hi.", "Hello.", "Good evening."]}, {"label": "3) Key question", "opts": ["Is tax included?", "What’s the total after tax?", "Do you take Visa?", "Can we pay separately?"]}, {"label": "4) Pay", "opts": ["I’ll pay by card, please.", "I’ll pay in cash, please.", "Can I pay contactless?", "Could I pay by card?"]}, {"label": "5) Problem (optional)", "opts": ["(no problem)", "My card was declined.", "It didn’t work.", "Can I try again, please?"]}, {"label": "6) Solution (optional)", "opts": ["(no solution)", "Could you help me, please?", "Can I pay in cash?", "I’ll try again, please."]}, {"label": "7) End", "opts": ["Could I have the receipt, please?", "Thank you!", "Thanks. Have a good day!", "That’s perfect, thank you."]}], "hint": "A1: start + 1 question + pay + end. A2/B1: add a problem + solution."};
  const ROLEPLAY={"a": "(Café) Would you like to pay by card or cash? — By card, please. — Tap your card. — Could I have the receipt, please?", "b": "(Shop) Is tax included? — No, tax is added. — What’s the total after tax? — It’s $22. — I’ll pay by card, please.", "c": "(Problem) It’s declined. — Can I try again, please? — Yes, or you can pay in cash. — I’ll pay in cash."};

  // TTS
  const KEYS={lang:"c_pay_lang", voice:"c_pay_voice", auto:"c_pay_auto"};
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

  // Score
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

  function initProvince(){
    const sel=$("#provPick"); if(!sel) return;
    sel.innerHTML = PROVINCES.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("");
    const saved=localStorage.getItem("c_pay_prov")||PROVINCES[0].id;
    sel.value=saved;
    const update=()=>{
      const p=PROVINCES.find(x=>x.id===sel.value)||PROVINCES[0];
      $("#provTax").textContent = `${p.name}: ${p.tax}`;
      localStorage.setItem("c_pay_prov", p.id);
    };
    sel.addEventListener("change", update);
    update();
  }

  // Vocabulary
  const V={cat:"All", revealed:new Set()};
  function vocabCats(){ return ["All", ...Array.from(new Set(VOCAB.map(x=>x.cat))).sort()]; }
  function renderVocab(){
    const sel=$("#vCat");
    sel.innerHTML=vocabCats().map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
    sel.value=V.cat;
    sel.addEventListener("change",()=>{V.cat=sel.value; renderVGrid();});
    renderVGrid();
  }
  function renderVGrid(){
    const grid=$("#vGrid"); grid.innerHTML="";
    const list = (V.cat==="All")?VOCAB:VOCAB.filter(x=>x.cat===V.cat);
    list.forEach(it=>{
      const key=it.cat+"::"+it.w;
      const card=document.createElement("div");
      card.className="card vocabCard";
      const open=V.revealed.has(key);
      card.innerHTML=`<div class="vocabTop"><div class="vocabWord">${esc(it.icon)} ${esc(it.w)}</div>
        <div class="vocabBtns"><button class="toolmini" data-act="s">🔊</button><button class="toolmini" data-act="t">${open?"🙈 Hide":"👀 Reveal"}</button></div></div>
        <div class="kcard ${open?"":"hidden"}" data-box="b">
          <div><strong>Meaning:</strong> ${esc(it.def)}</div>
          <div style="color:var(--muted);font-weight:850"><strong>FR:</strong> ${esc(it.fr)}</div>
          <div><strong>Example:</strong> ${esc(it.ex)}</div>
        </div>`;
      const box=card.querySelector('[data-box="b"]');
      const btn=card.querySelector('[data-act="t"]');
      tap(btn,()=>{ const hidden=box.classList.contains("hidden");
        if(hidden){ box.classList.remove("hidden"); V.revealed.add(key); btn.textContent="🙈 Hide"; }
        else { box.classList.add("hidden"); V.revealed.delete(key); btn.textContent="👀 Reveal"; }
      });
      tap(card.querySelector('[data-act="s"]'),()=>TTS.say(it.w+". "+it.ex));
      tap(card,(e)=>{ if(e?.target?.closest("button")) return; btn.click(); });
      grid.appendChild(card);
    });
  }
  function vocabQuiz(){
    const sample=shuffle(VOCAB).slice(0,6);
    const fb=$("#vFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("ok"); fb.innerHTML="";
    const wrap=document.createElement("div"); wrap.className="kcard";
    wrap.innerHTML="<strong>Vocabulary Quick Quiz (6)</strong><div class='tiny' style='color:var(--muted)'>Choose the best meaning.</div>";
    const meta=[];
    sample.forEach((it,i)=>{
      const choices=shuffle([it.def,"a bathroom","a ticket"]);
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
      meta.forEach((m,i)=>{const c=document.querySelector(`input[name="vq${i}"]:checked`); if(c && parseInt(c.value,10)===m.ans) correct++;});
      const b=$("#vqFb"); b.classList.remove("hidden","ok","no"); b.classList.add(correct>=5?"ok":"no"); b.textContent=`Score: ${correct}/6`;
      Score.award("vocab_quiz", correct);
    });
  }

  // Grammar
  function renderGrammar(){
    const grid=$("#gGrid"); grid.innerHTML="";
    Object.keys(GRAMMAR).forEach(k=>{
      const g=GRAMMAR[k];
      const card=document.createElement("div"); card.className="card";
      card.innerHTML=`<h3>${esc(g.title)}</h3>
        <div class="kcard"><strong>Rule</strong><br/>${g.rule.map(x=>"• "+esc(x)).join("<br/>")}</div>
        <div class="kcard" style="margin-top:.55rem"><strong>Examples</strong><br/>${g.examples.map(x=>"• "+esc(x)).join("<br/>")}</div>
        <div class="smallrow"><button class="toolmini" data-a="r">🔊 Rule</button><button class="toolmini" data-a="e">🔊 Examples</button></div>
        <div class="tiny" style="color:var(--muted)">${esc(g.note||"")}</div>`;
      tap(card.querySelector('[data-a="r"]'),()=>TTS.say(g.rule.join(". ")));
      tap(card.querySelector('[data-a="e"]'),()=>TTS.say(g.examples.join(". ")));
      grid.appendChild(card);
    });
  }

  // Runner helper
  function makeRunner(hostSel, fbSel, name, items, keyPrefix, pts=1){
    const S={order:[], idx:0, cur:null};
    const host=$(hostSel), fb=$(fbSel);
    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      host.innerHTML=`<div><strong>${esc(S.cur.prompt||S.cur.p)}</strong></div>`+
        (S.cur.choices||[]).map((c,i)=>`<label class="choice"><input type="radio" name="${name}" value="${i}"/><div>${esc(c)}</div></label>`).join("");
    }
    function start(){ S.order=shuffle(items.map(x=>x.id)); S.idx=0; next(true); }
    function next(fromStart=false){
      if(!S.order.length) return;
      if(!fromStart) S.idx++;
      if(S.idx>=S.order.length) S.idx=0;
      S.cur=items.find(x=>x.id===S.order[S.idx]);
      fb.classList.add("hidden"); render();
    }
    function hint(){ fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(S.cur?.hint||S.cur?.h||""); }
    function check(){
      fb.classList.remove("hidden","ok","no");
      const c=document.querySelector(`input[name="${name}"]:checked`);
      if(!c){ fb.classList.add("no"); fb.textContent="Choose an answer first."; return; }
      const ans=parseInt(c.value,10);
      const ok = (S.cur.ans!==undefined)? ans===S.cur.ans : ans===S.cur.a;
      fb.classList.add(ok?"ok":"no"); fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
      if(ok) Score.award(`${keyPrefix}:${S.cur.id}`, pts);
    }
    function reset(){ S.order=[]; S.cur=null; fb.classList.add("hidden"); host.textContent="Click Start."; }
    return {start,next,check,hint,reset};
  }

  const mcq=makeRunner("#mcqHost","#mcqFb","mcq",MCQ,"mcq",1);

  // Dropdown
  const ddS={order:[], idx:0, cur:null};
  function ddRender(){
    const host=$("#ddHost");
    if(!ddS.cur){ host.textContent="Click Start."; return; }
    host.innerHTML=`<div><strong>${esc(ddS.cur.prompt)}</strong></div><select class="select" id="ddSel">${ddS.cur.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>`;
  }
  function ddStart(){ ddS.order=shuffle(DROPDOWNS.map(x=>x.id)); ddS.idx=0; ddNext(true); }
  function ddNext(fromStart=false){
    if(!ddS.order.length) return;
    if(!fromStart) ddS.idx++;
    if(ddS.idx>=ddS.order.length) ddS.idx=0;
    ddS.cur=DROPDOWNS.find(x=>x.id===ddS.order[ddS.idx]);
    $("#ddFb").classList.add("hidden"); ddRender();
  }
  function ddHint(){ const fb=$("#ddFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(ddS.cur?.hint||""); }
  function ddCheck(){
    const fb=$("#ddFb"); fb.classList.remove("hidden","ok","no");
    const val=parseInt($("#ddSel").value,10);
    const ok=val===ddS.cur.ans;
    fb.classList.add(ok?"ok":"no"); fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
    if(ok) Score.award(`dd:${ddS.cur.id}`,1);
  }
  function ddReset(){ ddS.order=[]; ddS.cur=null; $("#ddFb").classList.add("hidden"); $("#ddHost").textContent="Click Start."; }

  // Sentence builder
  const ordS={order:[], idx:0, cur:null};
  function ordRender(){
    const host=$("#ordHost");
    if(!ordS.cur){ host.textContent="Click Start."; return; }
    const q=ordS.cur;
    const words=shuffle(q.words.slice());
    host.innerHTML=`<div><strong>Build the sentence</strong></div>
      <div class="kcard"><strong>First word:</strong> ${esc(q.first)}</div>
      <div class="bank" id="ordBank"></div><div class="zone" id="ordZone"></div>
      <div class="tiny" style="color:var(--muted)">Tap words to add. Tap in the sentence to remove.</div>`;
    const bank=host.querySelector("#ordBank");
    const zone=host.querySelector("#ordZone");
    const add=(tok)=>{
      tok.classList.add("is-used");
      const c=tok.cloneNode(true); c.classList.remove("is-used");
      tap(c,()=>{c.remove(); tok.classList.remove("is-used");});
      zone.appendChild(c);
    };
    words.forEach(w=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=w; t.dataset.word=w; t.draggable=true;
      tap(t,()=>{ if(t.classList.contains("is-used")) return; add(t); });
      t.addEventListener("dragstart",(e)=>e.dataTransfer.setData("text/plain", w));
      bank.appendChild(t);
    });
    zone.addEventListener("dragover",(e)=>e.preventDefault());
    zone.addEventListener("drop",(e)=>{
      e.preventDefault();
      const w=e.dataTransfer.getData("text/plain");
      const tok=Array.from(bank.querySelectorAll(".token")).find(x=>x.dataset.word===w && !x.classList.contains("is-used"));
      if(tok) add(tok);
    });
  }
  function ordStart(){ ordS.order=shuffle(ORDER_TASKS.map(x=>x.id)); ordS.idx=0; ordNext(true); }
  function ordNext(fromStart=false){
    if(!ordS.order.length) return;
    if(!fromStart) ordS.idx++;
    if(ordS.idx>=ordS.order.length) ordS.idx=0;
    ordS.cur=ORDER_TASKS.find(x=>x.id===ordS.order[ordS.idx]);
    $("#ordFb").classList.add("hidden"); ordRender();
  }
  function ordHint(){ const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(ordS.cur?.hint||""); }
  function ordCheck(){
    const q=ordS.cur;
    const zone=$("#ordHost").querySelector("#ordZone");
    const built=[q.first].concat($$(".token", zone).map(t=>t.textContent.trim())).join(" ").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award(`ord:${q.id}`,2);
  }
  function ordReset(){ ordS.order=[]; ordS.cur=null; $("#ordFb").classList.add("hidden"); $("#ordHost").textContent="Click Start."; }

  // Word bank
  const bankS={order:[], idx:0, cur:null};
  function bankRender(){
    const host=$("#bankHost");
    if(!bankS.cur){ host.textContent="Click Start."; return; }
    const q=bankS.cur;
    const bank=shuffle(q.bank.slice());
    host.innerHTML=`<div><strong>Fill the blanks</strong></div><div class="kcard" id="bankSentence"></div><div class="bank" id="bankWords"></div><div class="tiny" style="color:var(--muted)">Tap a word to fill the blank.</div>`;
    const sent=host.querySelector("#bankSentence");
    const words=host.querySelector("#bankWords");
    sent.innerHTML=q.template.map(x=>x==="____"?`<strong><span class="badge" data-b="1">____</span></strong>`:esc(x)).join(" ");
    bank.forEach(w=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=w;
      tap(t,()=>{
        const b=sent.querySelector("[data-b]");
        if(b.textContent!=="____") return;
        b.textContent=w;
        t.classList.add("is-used");
      });
      words.appendChild(t);
    });
  }
  function bankStart(){ bankS.order=shuffle(BANK_TASKS.map(x=>x.id)); bankS.idx=0; bankNext(true); }
  function bankNext(fromStart=false){
    if(!bankS.order.length) return;
    if(!fromStart) bankS.idx++;
    if(bankS.idx>=bankS.order.length) bankS.idx=0;
    bankS.cur=BANK_TASKS.find(x=>x.id===bankS.order[bankS.idx]);
    $("#bankFb").classList.add("hidden"); bankRender();
  }
  function bankHint(){ const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(bankS.cur?.hint||""); }
  function bankCheck(){
    const q=bankS.cur;
    const built=$("#bankHost").querySelector("#bankSentence").textContent.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award(`bank:${q.id}`,2);
  }
  function bankReset(){ bankS.order=[]; bankS.cur=null; $("#bankFb").classList.add("hidden"); $("#bankHost").textContent="Click Start."; }

  // Sorting
  function sortRender(){
    const host=$("#sortHost");
    host.innerHTML=`<div><strong>${esc(SORT_TASK.prompt)}</strong></div>
      <div class="smallrow" style="margin-top:.45rem"><div class="bank" id="sortBank"></div></div>
      <div class="grid2" style="margin-top:.55rem">${SORT_TASK.cats.map(c=>`<div class="kcard"><strong>${esc(c.label)}</strong><div class="zone" data-cat="${esc(c.id)}" style="margin-top:.45rem"></div></div>`).join("")}</div>
      <div class="tiny" style="color:var(--muted);margin-top:.45rem">Tap OR drag items into boxes.</div>`;
    const bank=host.querySelector("#sortBank");
    const zones=$$("[data-cat]", host);
    shuffle(SORT_TASK.items.slice()).forEach(it=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=it.t; t.dataset.answer=it.cat; t.draggable=true;
      tap(t,()=>{ const z=zones.find(x=>x.dataset.cat===it.cat); if(z) z.appendChild(t); });
      t.addEventListener("dragstart",(e)=>e.dataTransfer.setData("text/plain", it.t));
      bank.appendChild(t);
    });
    zones.forEach(z=>{
      z.addEventListener("dragover",(e)=>e.preventDefault());
      z.addEventListener("drop",(e)=>{
        e.preventDefault();
        const txt=e.dataTransfer.getData("text/plain");
        const tok=Array.from(host.querySelectorAll(".token")).find(x=>x.textContent===txt);
        if(tok) z.appendChild(tok);
      });
    });
  }
  function sortHint(){ const fb=$("#sortFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+SORT_TASK.hint; }
  function sortCheck(){
    const host=$("#sortHost");
    let total=0, correct=0;
    $$("[data-cat]", host).forEach(z=>{
      const cat=z.dataset.cat;
      $$(".token", z).forEach(t=>{ total++; if(t.dataset.answer===cat) correct++; });
    });
    const fb=$("#sortFb"); fb.classList.remove("hidden","ok","no");
    const ok= total===SORT_TASK.items.length && correct===total;
    fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Perfect!":`Score: ${correct}/${SORT_TASK.items.length}. (Place all items.)`;
    if(ok) Score.award("sort",4);
  }
  function sortReset(){ $("#sortFb").classList.add("hidden"); sortRender(); }

  // Trainer
  let trLevel="easy";
  const tr=makeRunner("#trHost","#trFb","tr",TRAIN[trLevel],"tr",2);
  function setTR(level){
    trLevel=level;
    $("#trEasy").classList.toggle("is-on", level==="easy");
    $("#trMed").classList.toggle("is-on", level==="medium");
    $("#trHard").classList.toggle("is-on", level==="hard");
    // rebuild runner with new items
  }
  let trRunner=null;
  function makeTR(level){
    trRunner=makeRunner("#trHost","#trFb","tr",TRAIN[level],"tr",2);
  }

  // Roleplays
  function setupRoleplays(){
    $("#rpA").textContent=ROLEPLAY.a;
    $("#rpB").textContent=ROLEPLAY.b;
    $("#rpC").textContent=ROLEPLAY.c;
    $$("[data-rp][data-act]").forEach(btn=>{
      const key=btn.dataset.rp, act=btn.dataset.act;
      const box= key==="a"?$("#rpA"):key==="b"?$("#rpB"):$("#rpC");
      tap(btn,()=>{
        if(act==="show") box.classList.remove("hidden");
        if(act==="hide") box.classList.add("hidden");
        if(act==="listen") TTS.say(box.textContent || ROLEPLAY[key]);
      });
    });
  }

  // Listening
  const Lis={cur:null, show:false};
  function loadLis(id){
    Lis.cur=LISTENING.find(x=>x.id===id)||LISTENING[0];
    Lis.show=false;
    renderLis();
    renderLisQ();
    $("#lisQFb").classList.add("hidden");
  }
  function renderLis(){
    const d=Lis.cur; const stream=$("#lisStream"); stream.innerHTML="";
    d.lines.forEach(ln=>{
      const b=document.createElement("div"); b.className="bubble "+(ln.side==="a"?"a":"b");
      b.innerHTML=`<div class="who">${ln.side==="a"?"🟦":"🟩"} ${esc(ln.who)}</div>
        <div class="txt">${Lis.show?esc(ln.say):"<span class='badge'>Hidden</span>"}</div>
        <div class="tools"><button class="toolmini" data-act="s">🔊 Listen</button></div>`;
      tap(b.querySelector('[data-act="s"]'),()=>TTS.say(ln.say));
      stream.appendChild(b);
    });
  }
  function renderLisQ(){
    const host=$("#lisQHost");
    const qset=LQ[Lis.cur.id]||[];
    host.innerHTML=qset.map((q,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div><strong>Q${i+1}:</strong> ${esc(q[0])}</div>
      ${[q[1],q[2],q[3]].map((c,ci)=>`<label class="choice"><input type="radio" name="lq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")}
    </div>`).join("");
    host.dataset.qset=JSON.stringify(qset);
  }
  function lisPlayAll(){
    const d=Lis.cur; let i=0;
    const next=()=>{ if(i>=d.lines.length) return; TTS.say(d.lines[i].say); i++; setTimeout(next,1700); };
    next();
  }
  function lisCheck(){
    const qset=JSON.parse($("#lisQHost").dataset.qset||"[]");
    let correct=0;
    qset.forEach((q,i)=>{
      const c=document.querySelector(`input[name="lq${i}"]:checked`);
      if(c && parseInt(c.value,10)===q[4]) correct++;
    });
    const fb=$("#lisQFb"); fb.classList.remove("hidden","ok","no");
    const ok=correct>=4;
    fb.classList.add(ok?"ok":"no");
    fb.textContent=`Score: ${correct}/${qset.length}`;
    if(ok) Score.award(`listening:${Lis.cur.id}`,4);
  }

  // Builder
  let buildLevel="A1";
  function setBuildLevel(level){
    buildLevel=level;
    $("#lvlA1").classList.toggle("is-on", level==="A1");
    $("#lvlA2").classList.toggle("is-on", level==="A2");
    $("#lvlB1").classList.toggle("is-on", level==="B1");
    updateBuild();
  }
  function renderBuilder(){
    const host=$("#buildHost");
    host.innerHTML = `<div class="kcard"><strong>${esc(BUILDER.title)}</strong><div class="tiny" style="color:var(--muted)">${esc(BUILDER.hint)}</div></div>
      <div id="bb"></div>
      <div class="kcard" style="margin-top:.55rem"><strong>Your script:</strong><br/><span id="buildOut"></span></div>`;
    const bb=host.querySelector("#bb");
    bb.innerHTML = BUILDER.steps.map((st,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div><strong>${esc(st.label)}</strong></div>
      <select class="select" data-step="${i}">${st.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
    </div>`).join("");
    $$("select[data-step]", bb).forEach(sel=>sel.addEventListener("change", updateBuild));
    updateBuild();
  }
  function updateBuild(){
    const vals=$$("select[data-step]", $("#buildHost")).map(s=>s.value);
    const place=vals[0], start=vals[1], q=vals[2], pay=vals[3], prob=vals[4], sol=vals[5], end=vals[6];
    let out = `${start} We have just arrived at the ${place}. ${q} ${pay} ${end}`;
    if(buildLevel!=="A1"){
      if(prob!=="(no problem)") out += ` ${prob}`;
      if(sol!=="(no solution)") out += ` ${sol}`;
    }
    if(buildLevel==="B1") out += " Thank you for your help.";
    out = out.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    $("#buildOut").textContent=out;
  }
  function buildCheck(){
    const txt=$("#buildOut").textContent;
    const hasQ=/tax included|total after tax|take visa|pay separately/i.test(txt);
    const hasPay=/pay by card|pay in cash|contactless/i.test(txt);
    const hasPolite=/please|thank you|thanks|receipt/i.test(txt);
    const hasProb=/declined|didn’t work|try again/i.test(txt);
    const fb=$("#buildFb"); fb.classList.remove("hidden","ok","no");
    let ok=true, msg="✅ Great!";
    if(!hasQ){ ok=false; msg="❌ Add one key question (tax/total/cards)."; }
    else if(!hasPay){ ok=false; msg="❌ Add a payment method (card/cash/contactless)."; }
    else if(!hasPolite){ ok=false; msg="❌ Add a polite ending (receipt/thank you)."; }
    else if(buildLevel!=="A1" && !hasProb){ ok=false; msg="❌ For A2/B1, add a problem/solution line (declined / try again)."; }
    fb.classList.add(ok?"ok":"no"); fb.textContent=msg;
    if(ok) Score.award("builder:"+buildLevel, buildLevel==="A1"?3:buildLevel==="A2"?5:7);
  }

  function resetAll(){
    TTS.stop(); Score.reset();
    V.revealed.clear(); V.cat="All";
    $("#vFb").classList.add("hidden");
    mcq.reset(); ddReset(); ordReset(); bankReset(); sortReset();
    makeTR("easy"); trLevel="easy";
    $("#trEasy").classList.add("is-on"); $("#trMed").classList.remove("is-on"); $("#trHard").classList.remove("is-on");
    setupRoleplays();
    loadLis(LISTENING[0].id);
    renderBuilder(); setBuildLevel("A1");
    document.getElementById("top").scrollIntoView({behavior:"smooth"});
  }

  async function init(){
    if(localStorage.getItem(KEYS.auto)===null) TTS.setAuto(false);
    Score.setMax(85);
    await buildVoiceSelect();
    syncAccent(); syncAuto();
    initProvince();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});

    tap($("#btnTestVoice"),()=>TTS.say("Could I have the receipt, please? What’s the total after tax?"));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnStart"),()=>document.getElementById("secVocab").scrollIntoView({behavior:"smooth"}));
    tap($("#btnHow"),()=>alert("How to use:\n\n1) Choose accent.\n2) Province picker (optional).\n3) Vocabulary.\n4) Grammar patterns.\n5) Exercises + trainer.\n6) Roleplays.\n7) Listening with transcript.\n8) Script Builder."));

    tap($("#btnResetAll"),()=>{ if(confirm("Reset the whole page?")) resetAll(); });

    tap($("#btnVRevealAll"),()=>{VOCAB.forEach(it=>V.revealed.add(it.cat+'::'+it.w)); renderVGrid();});
    tap($("#btnVHideAll"),()=>{V.revealed.clear(); renderVGrid();});
    tap($("#btnVQuiz"),()=>vocabQuiz());

    renderVocab();
    renderGrammar();

    tap($("#mcqStart"),()=>mcq.start());
    tap($("#mcqCheck"),()=>mcq.check());
    tap($("#mcqNext"),()=>mcq.next(false));
    tap($("#mcqHint"),()=>mcq.hint());
    tap($("#mcqReset"),()=>mcq.reset());

    tap($("#ddStart"),()=>ddStart());
    tap($("#ddCheck"),()=>ddCheck());
    tap($("#ddNext"),()=>ddNext(false));
    tap($("#ddHint"),()=>ddHint());
    tap($("#ddReset"),()=>ddReset());

    tap($("#ordStart"),()=>ordStart());
    tap($("#ordCheck"),()=>ordCheck());
    tap($("#ordHint"),()=>ordHint());
    tap($("#ordReset"),()=>ordReset());

    tap($("#bankStart"),()=>bankStart());
    tap($("#bankCheck"),()=>bankCheck());
    tap($("#bankHint"),()=>bankHint());
    tap($("#bankReset"),()=>bankReset());

    sortRender();
    tap($("#sortCheck"),()=>sortCheck());
    tap($("#sortHint"),()=>sortHint());
    tap($("#sortReset"),()=>sortReset());

    // Trainer
    makeTR("easy");
    tap($("#trEasy"),()=>{makeTR("easy"); setTR("easy");});
    tap($("#trMed"),()=>{makeTR("medium"); setTR("medium");});
    tap($("#trHard"),()=>{makeTR("hard"); setTR("hard");});
    tap($("#trStart"),()=>trRunner.start());
    tap($("#trCheck"),()=>trRunner.check());
    tap($("#trNext"),()=>trRunner.next(false));
    tap($("#trHint"),()=>trRunner.hint());
    tap($("#trReset"),()=>trRunner.reset());

    // Roleplays
    setupRoleplays();

    // Listening
    $("#lisPick").innerHTML=LISTENING.map(d=>`<option value="${esc(d.id)}">${esc(d.title)}</option>`).join("");
    $("#lisPick").addEventListener("change",()=>loadLis($("#lisPick").value));
    loadLis($("#lisPick").value||LISTENING[0].id);
    tap($("#lisPlayAll"),()=>lisPlayAll());
    tap($("#lisShow"),()=>{Lis.show=true; renderLis();});
    tap($("#lisHide"),()=>{Lis.show=false; renderLis();});
    tap($("#lisCheck"),()=>lisCheck());
    tap($("#lisReset"),()=>{renderLisQ(); $("#lisQFb").classList.add("hidden");});

    // Builder
    renderBuilder();
    setBuildLevel("A1");
    tap($("#lvlA1"),()=>setBuildLevel("A1"));
    tap($("#lvlA2"),()=>setBuildLevel("A2"));
    tap($("#lvlB1"),()=>setBuildLevel("B1"));
    tap($("#buildListen"),()=>TTS.say($("#buildOut").textContent));
    tap($("#buildCheck"),()=>buildCheck());
    tap($("#buildReset"),()=>{renderBuilder(); $("#buildFb").classList.add("hidden"); setBuildLevel(buildLevel);});

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  init();
})();
