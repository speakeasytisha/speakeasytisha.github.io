/* SpeakEasyTisha • Credit in the USA — Follow-up (Renting MA & NH)
   Touch-friendly interactive lesson (Mac + iPad Safari)
   - EN/FR toggle
   - US/UK speechSynthesis (robust)
   - Drag OR Tap mode for matching + drag bucket activities
   - Fill-in with word bank (drag/tap)
   - Sentence builder
   - Reorder with drag + up/down fallback
   - Role-play dialogues + shadow mode
   - Global score top+bottom + localStorage
*/
(function(){
  "use strict";

  /* -----------------------------
     Helpers
  ----------------------------- */
  function $(id){ return document.getElementById(id); }
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t = a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  /* -----------------------------
     State (localStorage)
  ----------------------------- */
  var KEY = "se_credit_us_followup_v1";
  var state = {
    lang: "EN",
    accent: "en-US",
    tapMode: false,
    score: 0,
    streak: 0,
    checklist: {},
    done: {},
    ttsUnlocked: false
  };

  function loadState(){
    try{
      var raw = localStorage.getItem(KEY);
      if(raw){
        var obj = JSON.parse(raw);
        Object.assign(state, obj||{});
      }
    }catch(e){}
  }
  function saveState(){
    try{
      localStorage.setItem(KEY, JSON.stringify(state));
      setSaved(true);
      setTimeout(function(){ setSaved(false); }, 800);
    }catch(e){}
  }

  /* -----------------------------
     UI: badges
  ----------------------------- */
  function setBadges(){
    var sb = $("scoreBadge"), sb2 = $("scoreBadge2");
    var st = $("streakBadge"), st2 = $("streakBadge2");
    if(sb) sb.textContent = "Score: " + state.score;
    if(sb2) sb2.textContent = "Score: " + state.score;
    if(st) st.textContent = "Streak: " + state.streak;
    if(st2) st2.textContent = "Streak: " + state.streak;
  }
  function setSaved(on){
    var el = $("savedBadge"), el2 = $("savedBadge2");
    if(!el || !el2) return;
    el.style.opacity = on ? "1" : ".55";
    el2.style.opacity = on ? "1" : ".55";
  }
  function addScore(points){
    state.score += points;
    if(points > 0) state.streak += 1;
    else state.streak = 0;
    setBadges();
    saveState();
  }

  /* -----------------------------
     Language (EN/FR)
  ----------------------------- */
  var I18N = {
    FR: {
      hero_p: "Apprenez le vocabulaire, les règles et les phrases « pro » pour la location, les factures (utilities) et la vie quotidienne. Page conçue pour parler un maximum avec des scripts courts et efficaces.",
      tour_hint: "Astuce : cliquez une fois sur « Enable voice » (iPad/iPhone), puis utilisez les boutons 🔊.",
      big_idea_h: "L’essentiel",
      big_idea_ul: "<li><strong>Credit report</strong> = votre historique (comptes, paiements, adresses).</li><li><strong>Credit score</strong> = un chiffre qui résume cet historique.</li><li>Aux États‑Unis, le crédit sert souvent pour <strong>logement, utilities, téléphone, voiture</strong>.</li>",
      note_h: "Bonne nouvelle :",
      note_p: "vous pouvez construire votre crédit étape par étape avec les bons outils et de bonnes habitudes.",
      qs_p: "Suivez ce plan simple. Cochez au fur et à mesure — la page enregistre votre progression.",
      rentbridge_p: "Quand un propriétaire lance un screening, il veut des preuves de paiements fiables. Si votre historique américain est récent, vous pouvez renforcer votre dossier et l’expliquer poliment.",
      vocab_p: "Touchez une carte pour la retourner. Utilisez 🔊 pour écouter. Filtrez par thème.",
      grammar_p: "Utilisez ces structures pour être poli(e) et clair(e) au téléphone ou par email.",
      numbers_p: "Aux États‑Unis, on dit souvent les chiffres un par un : 617‑555‑0123 → « six one seven… »",
      ex_p: "Feedback immédiat • indices • score.",
      speak_p: "Vous allez paraître très à l’aise grâce à des scripts courts et professionnels.",
      temp_p: "Construisez un message rapidement puis copiez. Parfait pour la location et la banque."
    }
  };

  function applyI18N(){
    var dict = I18N[state.lang];
    qsa("[data-i18n]").forEach(function(el){
      var k = el.getAttribute("data-i18n");
      if(!dict || !dict[k]) return;
      if(k.endsWith("_ul")) el.innerHTML = dict[k];
      else el.textContent = dict[k];
    });
    // update pressed states
    if($("langEN")) $("langEN").setAttribute("aria-pressed", state.lang==="EN" ? "true":"false");
    if($("langFR")) $("langFR").setAttribute("aria-pressed", state.lang==="FR" ? "true":"false");
  }

  /* -----------------------------
     Voice (robust)
  ----------------------------- */
  var Voice = {
    voices: [],
    ready: false,
    initDone: false,
    get supported(){ return !!(window.speechSynthesis && window.SpeechSynthesisUtterance); }
  };

  function voiceBadge(msg){
    var b = $("voiceBadge"), b2=$("voiceBadge2");
    if(b) b.textContent = msg;
    if(b2) b2.textContent = msg;
  }

  function refreshVoices(){
    if(!Voice.supported) { voiceBadge("Voice: not supported"); return; }
    try{ Voice.voices = window.speechSynthesis.getVoices() || []; }catch(e){ Voice.voices=[]; }
    Voice.ready = Voice.voices.length > 0;
    voiceBadge(Voice.ready ? ("Voice: ready ("+Voice.voices.length+")") : "Voice: loading…");
  }

  function pickVoice(lang){
    var v = Voice.voices || [];
    if(!v.length) return null;
    var target = String(lang||"").toLowerCase();
    for(var i=0;i<v.length;i++){
      if(String(v[i].lang||"").toLowerCase() === target) return v[i];
    }
    var pref = target.split("-")[0];
    for(var j=0;j<v.length;j++){
      var l = String(v[j].lang||"").toLowerCase();
      if(l.indexOf(pref)===0) return v[j];
    }
    return v[0];
  }

  function enableVoice(){
    if(!Voice.supported){ voiceBadge("Voice: not supported"); return false; }
    try{ window.speechSynthesis.cancel(); }catch(e){}
    // iOS unlock trick: silent utterance inside user gesture
    try{
      var u = new SpeechSynthesisUtterance(" ");
      u.lang = state.accent;
      u.volume = 0;
      window.speechSynthesis.speak(u);
      state.ttsUnlocked = true;
      saveState();
    }catch(e2){}
    refreshVoices();
    // quick audible confirmation
    speakNow(state.lang==="FR" ? "Voix activée." : "Voice enabled.");
    return true;
  }

  function speakNow(text){
    if(!Voice.supported) return;
    var t = String(text||"").trim();
    if(!t) return;

    // If iOS requires unlock, speaking is itself a gesture when button clicked.
    try{ window.speechSynthesis.resume(); }catch(e){}
    try{
      if(window.speechSynthesis.speaking || window.speechSynthesis.pending){
        window.speechSynthesis.cancel();
      }
    }catch(e2){}

    var u = new SpeechSynthesisUtterance(t);
    u.lang = state.accent;
    u.rate = 0.95;

    refreshVoices();
    var voice = pickVoice(state.accent);
    if(voice) u.voice = voice;

    u.onstart = function(){ voiceBadge("Voice: speaking…"); };
    u.onend = function(){ refreshVoices(); };
    u.onerror = function(){ voiceBadge("Voice: error (try Chrome/Safari)"); };

    // some browsers need a tiny delay after cancel()
    setTimeout(function(){
      try{ window.speechSynthesis.speak(u); }catch(e3){}
    }, 30);
  }

  function stopSpeaking(){
    if(!Voice.supported) return;
    try{ window.speechSynthesis.cancel(); }catch(e){}
    refreshVoices();
  }

  /* -----------------------------
     Data
  ----------------------------- */
  var CHECKLISTS = {
    week1: [
      { id:"addr", icon:"🏠", en:"Get a stable U.S. address (lease / temporary housing).", fr:"Avoir une adresse stable aux USA (bail / logement temporaire)." },
      { id:"bank", icon:"🏦", en:"Open a checking account (and set online banking).", fr:"Ouvrir un compte bancaire (checking) + banque en ligne." },
      { id:"phone", icon:"📱", en:"Get a U.S. phone number (for applications).", fr:"Avoir un numéro US (pour les dossiers)." },
      { id:"docs", icon:"📄", en:"Prepare documents: ID, income, references, bank statements.", fr:"Préparer les documents : ID, revenus, références, relevés bancaires." },
      { id:"budget", icon:"🧾", en:"Know the key fees: deposit, application fee, first/last month.", fr:"Connaître les frais : dépôt, frais de dossier, 1er/dernier mois." }
    ],
    w2to6: [
      { id:"secured", icon:"💳", en:"Apply for a secured credit card (or starter card).", fr:"Demander une carte sécurisée (secured) ou débutant." },
      { id:"autopay", icon:"⏱️", en:"Turn on autopay for at least the minimum payment.", fr:"Activer l’autopay au moins pour le minimum." },
      { id:"util", icon:"📉", en:"Keep utilization low (try under ~30%).", fr:"Garder l’utilisation basse (viser < ~30%)." },
      { id:"onTime", icon:"✅", en:"Pay on time (no late payments).", fr:"Payer à l’heure (zéro retard)." },
      { id:"track", icon:"🔎", en:"Check your credit report for errors.", fr:"Vérifier le credit report (erreurs)." }
    ],
    m2to6: [
      { id:"limit", icon:"📈", en:"Ask for a limit increase (if available).", fr:"Demander une augmentation de limite (si possible)." },
      { id:"mix", icon:"🧩", en:"Add a second tool (credit-builder loan / authorized user).", fr:"Ajouter un second outil (credit-builder loan / authorized user)." },
      { id:"freeze", icon:"🧊", en:"Consider a free credit freeze for identity protection.", fr:"Éventuellement geler le dossier (freeze) gratuitement (anti-fraude)." },
      { id:"rentRpt", icon:"🏡", en:"If possible, use rent reporting (optional).", fr:"Si possible, rent reporting (optionnel)." }
    ]
  };

  var BRIDGE_LINES = [
    { en:"Hi, I’m applying for the apartment. I can provide proof of income and bank statements.", fr:"Bonjour, je candidate. Je peux fournir des preuves de revenus et des relevés bancaires." },
    { en:"My U.S. credit history is new. Could you accept additional documents and references?", fr:"Mon historique de crédit américain est récent. Pourriez‑vous accepter des documents et références en plus ?" },
    { en:"Would a higher deposit or a co-signer help in this situation?", fr:"Est‑ce qu’un dépôt plus élevé ou un garant (co‑signer) aiderait ?" },
    { en:"Could you tell me which report you use for screening (Equifax, Experian, TransUnion)?", fr:"Pouvez‑vous me dire quel bureau vous utilisez (Equifax, Experian, TransUnion) ?" }
  ];

  var VOCAB = [
    { cat:"Basics", icon:"📄", term:"credit report", fr:"rapport de crédit", def:"A record of your credit history.", ex:"I requested my credit report to check for errors." },
    { cat:"Basics", icon:"🔢", term:"credit score", fr:"score de crédit", def:"A number that summarizes your credit history.", ex:"My credit score improved after on-time payments." },
    { cat:"Cards", icon:"💳", term:"secured credit card", fr:"carte sécurisée", def:"A credit card backed by a refundable deposit.", ex:"A secured card can help you start building credit." },
    { cat:"Cards", icon:"📅", term:"due date", fr:"date d’échéance", def:"The date your payment must be received.", ex:"My due date is the 15th of every month." },
    { cat:"Cards", icon:"🧾", term:"statement", fr:"relevé", def:"A monthly summary of charges and balance.", ex:"I read my statement every month." },
    { cat:"Basics", icon:"📉", term:"utilization", fr:"taux d’utilisation", def:"How much of your credit limit you use.", ex:"Low utilization can help your score." },
    { cat:"Basics", icon:"🏦", term:"credit limit", fr:"plafond", def:"The maximum you can borrow on a card.", ex:"My credit limit is $500." },
    { cat:"Basics", icon:"💰", term:"APR (interest rate)", fr:"taux d’intérêt", def:"The yearly cost of borrowing on a balance.", ex:"The APR applies if you carry a balance." },
    { cat:"Applications", icon:"🔍", term:"hard inquiry", fr:"enquête (hard)", def:"A credit check that can affect your score.", ex:"A hard inquiry happens when you apply for credit." },
    { cat:"Applications", icon:"👀", term:"soft inquiry", fr:"enquête (soft)", def:"A check that doesn’t impact your score.", ex:"Pre-qualification can be a soft inquiry." },
    { cat:"Protection", icon:"🧊", term:"credit freeze", fr:"gel du dossier", def:"Restricts access to your credit file.", ex:"I placed a freeze to prevent identity theft." },
    { cat:"Protection", icon:"🚨", term:"fraud alert", fr:"alerte fraude", def:"A notice that lenders should verify identity.", ex:"I added a fraud alert after a data breach." },
    { cat:"Fixing", icon:"🛠️", term:"dispute", fr:"contestations", def:"A request to correct an error on your report.", ex:"I filed a dispute for an incorrect account." },
    { cat:"People", icon:"🤝", term:"co-signer", fr:"garant", def:"Someone who agrees to repay if you don’t.", ex:"A co-signer can help qualify for a loan." },
    { cat:"People", icon:"👤", term:"authorized user", fr:"utilisateur autorisé", def:"Someone added to another person’s card.", ex:"An authorized user can benefit from the account history." },
    { cat:"Basics", icon:"📦", term:"collection", fr:"recouvrement", def:"An unpaid debt sent to a collection agency.", ex:"Collections can damage your credit." },
    { cat:"Renting", icon:"🏠", term:"screening", fr:"vérification", def:"A background/credit check for an application.", ex:"The landlord uses screening to verify applicants." },
    { cat:"Renting", icon:"📝", term:"application fee", fr:"frais de dossier", def:"A fee to process an application.", ex:"The application fee is non-refundable." },
    { cat:"Utilities", icon:"⚡", term:"utility deposit", fr:"dépôt (utilities)", def:"A deposit required for electricity/gas/water.", ex:"The utility deposit may be higher with new credit." }
  ];

  var CREDIT_WORDS = [
    ["Payment history", "Whether you pay on time."],
    ["Amounts owed", "How much you use vs your limit."],
    ["Length of history", "Older accounts can help."],
    ["New credit", "Many new accounts can hurt (short-term)."],
    ["Credit mix", "Different account types."]
  ];

  /* -----------------------------
     Build: checklists
  ----------------------------- */
  function renderChecklist(containerId, items){
    var box = $(containerId);
    if(!box) return;
    box.innerHTML = "";
    items.forEach(function(it){
      var key = "chk_"+it.id;
      var checked = !!state.checklist[key];

      var row = document.createElement("label");
      row.className = "checkRow";
      row.style.display="flex";
      row.style.alignItems="center";
      row.style.gap="10px";
      row.style.padding="10px 12px";
      row.style.border="1px solid rgba(255,255,255,.12)";
      row.style.borderRadius="14px";
      row.style.background="rgba(0,0,0,.18)";
      row.style.marginBottom="10px";

      var cb = document.createElement("input");
      cb.type="checkbox";
      cb.checked = checked;
      cb.style.width="18px";
      cb.style.height="18px";
      cb.addEventListener("change", function(){
        state.checklist[key] = cb.checked;
        addScore(cb.checked ? 1 : 0);
        saveState();
      });

      var text = document.createElement("div");
      text.style.flex="1";
      text.innerHTML = "<div style='font-weight:800'>"+esc(it.icon+" "+(state.lang==="FR"?it.fr:it.en))+"</div>";

      var sp = document.createElement("button");
      sp.className = "btn";
      sp.type="button";
      sp.textContent = "🔊";
      sp.title = "Listen";
      sp.addEventListener("click", function(e){
        e.preventDefault();
        speakNow(state.lang==="FR"?it.fr:it.en);
      });

      row.appendChild(cb);
      row.appendChild(text);
      row.appendChild(sp);
      box.appendChild(row);
    });
  }

  function renderBridgeChips(){
    var box = $("rentBridgeChips");
    if(!box) return;
    box.innerHTML = "";
    BRIDGE_LINES.forEach(function(l, idx){
      var b = document.createElement("button");
      b.className = "chip";
      b.type = "button";
      b.textContent = (idx+1)+". " + (state.lang==="FR"?l.fr:l.en);
      b.addEventListener("click", function(){
        speakNow(state.lang==="FR"?l.fr:l.en);
      });
      box.appendChild(b);
    });
  }

  /* -----------------------------
     Vocabulary cards
  ----------------------------- */
  function vocabCats(){
    var set = {};
    VOCAB.forEach(function(v){ set[v.cat]=true; });
    return Object.keys(set).sort();
  }

  function renderVocabFilters(){
    var sel = $("vocabFilter");
    if(!sel) return;
    sel.innerHTML = '<option value="all">'+(state.lang==="FR"?"Tous les thèmes":"All themes")+'</option>';
    vocabCats().forEach(function(c){
      var o=document.createElement("option");
      o.value=c;
      o.textContent=c;
      sel.appendChild(o);
    });
  }

  function renderCards(){
    var box = $("vocabCards");
    if(!box) return;
    var q = ($("vocabSearch") ? $("vocabSearch").value.trim().toLowerCase() : "");
    var cat = $("vocabFilter") ? $("vocabFilter").value : "all";

    var list = VOCAB.filter(function(v){
      if(cat!=="all" && v.cat!==cat) return false;
      if(!q) return true;
      var hay = (v.term+" "+v.fr+" "+v.def+" "+v.ex+" "+v.cat).toLowerCase();
      return hay.indexOf(q) >= 0;
    });

    box.innerHTML = "";
    list.forEach(function(v, idx){
      var card = document.createElement("div");
      card.className = "flip";
      card.setAttribute("tabindex","0");
      card.setAttribute("role","button");
      card.setAttribute("aria-pressed","false");
      card.dataset.term = v.term;

      var top = document.createElement("div");
      top.className="flip__top";

      var icon = document.createElement("div");
      icon.className="flip__icon";
      icon.textContent=v.icon;

      var txt = document.createElement("div");
      txt.style.flex="1";
      txt.innerHTML = "<div class='flip__term'>"+esc(v.term)+"</div>"+
                      "<div class='flip__meta'>"+esc(v.fr)+" • "+esc(v.cat)+"</div>";

      var speakBtn = document.createElement("button");
      speakBtn.className="btn";
      speakBtn.type="button";
      speakBtn.textContent="🔊";
      speakBtn.addEventListener("click", function(e){
        e.stopPropagation();
        speakNow(v.term + ". " + v.def);
      });

      top.appendChild(icon);
      top.appendChild(txt);
      top.appendChild(speakBtn);

      var back = document.createElement("div");
      back.className="flip__back";
      back.innerHTML = "<div><strong>"+(state.lang==="FR"?"Définition":"Definition")+":</strong> "+esc(v.def)+"</div>"+
                       "<div class='flip__hint'><strong>"+(state.lang==="FR"?"Exemple":"Example")+":</strong> "+esc(v.ex)+"</div>"+
                       "<div class='flip__actions'>"+
                         "<button class='chip' type='button' data-action='ex'>"+(state.lang==="FR"?"Dire l’exemple":"Say the example")+" 🔊</button>"+
                         "<button class='chip' type='button' data-action='pro'>"+(state.lang==="FR"?"Phrase pro":"Pro phrase")+" 🔊</button>"+
                       "</div>";

      card.appendChild(top);
      card.appendChild(back);

      function toggleFlip(){
        var on = !card.classList.contains("is-flipped");
        card.classList.toggle("is-flipped", on);
        card.setAttribute("aria-pressed", on ? "true":"false");
        if(on && !state.done["card_"+v.term]){
          state.done["card_"+v.term]=true;
          addScore(1);
        }
      }

      card.addEventListener("click", toggleFlip);
      card.addEventListener("keydown", function(e){
        if(e.key==="Enter" || e.key===" "){ e.preventDefault(); toggleFlip(); }
      });

      back.addEventListener("click", function(e){
        var t = e.target;
        if(t && t.getAttribute("data-action")==="ex"){
          e.stopPropagation();
          speakNow(v.ex);
        }
        if(t && t.getAttribute("data-action")==="pro"){
          e.stopPropagation();
          speakNow("Could you please confirm the due date and the minimum payment?");
        }
      });

      box.appendChild(card);
    });

    if(list.length===0){
      box.innerHTML = "<div class='well'>"+(state.lang==="FR"?"Aucun résultat.":"No results.")+"</div>";
    }
  }

  /* -----------------------------
     Mini grammar tasks
  ----------------------------- */
  function renderUpgradeTask(){
    var box = $("upgradeTask");
    if(!box) return;
    var base = state.lang==="FR"
      ? "Expliquez les frais."
      : "Explain the fees.";
    var opts = state.lang==="FR"
      ? ["Pouvez-vous expliquer les frais, s’il vous plaît ?","Je voudrais que vous expliquiez les frais.","Expliquez les frais, maintenant."]
      : ["Could you please explain the fees?","I want you to explain the fees.","Explain the fees, now."];
    var correct = 0;

    box.innerHTML = "";
    var line = document.createElement("div");
    line.className="line";
    line.innerHTML = "<span class='mono'>"+esc(base)+"</span>";

    var sel = document.createElement("select");
    sel.className="select";
    opts.forEach(function(o,i){
      var op=document.createElement("option");
      op.value=String(i);
      op.textContent=o;
      sel.appendChild(op);
    });

    var btn = document.createElement("button");
    btn.className="btn btn--primary";
    btn.type="button";
    btn.textContent = state.lang==="FR" ? "Vérifier" : "Check";

    var fb = document.createElement("div");
    fb.className="mini";
    fb.style.marginTop="8px";

    btn.addEventListener("click", function(){
      var pick = parseInt(sel.value,10);
      if(pick===correct){
        fb.textContent = state.lang==="FR" ? "✅ Parfait. C’est poli et professionnel." : "✅ Great. Polite and professional.";
        addScore(2);
        speakNow(opts[pick]);
      }else{
        fb.textContent = state.lang==="FR" ? "❌ Essaie encore. Utilise Could/Would + please." : "❌ Try again. Use Could/Would + please.";
        addScore(0);
      }
    });

    line.appendChild(sel);
    line.appendChild(btn);
    box.appendChild(line);
    box.appendChild(fb);
  }

  function renderDateBuilder(){
    var box = $("dateBuilder");
    if(!box) return;

    var target = state.lang==="FR"
      ? "Mon rendez-vous est lundi à trois heures de l’après-midi."
      : "My appointment is on Monday at three p.m.";
    var words = state.lang==="FR"
      ? ["Mon","rendez-vous","est","lundi","à","trois","heures","de","l’après-midi"]
      : ["My","appointment","is","on","Monday","at","three","p.m."];

    box.innerHTML = "";
    var bank = document.createElement("div");
    bank.className="builder__bank";
    var out = document.createElement("div");
    out.className="builder__out";
    out.setAttribute("aria-label","Sentence output");

    function renderBank(){
      bank.innerHTML = "";
      shuffle(words).forEach(function(w){
        var t = document.createElement("button");
        t.className="tile";
        t.type="button";
        t.textContent=w;
        t.addEventListener("click", function(){
          out.appendChild(makeOutTile(w));
          t.disabled=true;
        });
        bank.appendChild(t);
      });
    }

    function makeOutTile(word){
      var t = document.createElement("button");
      t.className="tile";
      t.type="button";
      t.textContent=word;
      t.title = state.lang==="FR" ? "Retirer" : "Remove";
      t.addEventListener("click", function(){
        t.remove();
        // re-enable matching bank tile
        qsa(".builder__bank .tile", box).forEach(function(b){
          if(b.textContent===word) b.disabled=false;
        });
      });
      return t;
    }

    var row = document.createElement("div");
    row.className="row";
    var btnCheck = document.createElement("button");
    btnCheck.className="btn btn--primary";
    btnCheck.type="button";
    btnCheck.textContent = state.lang==="FR" ? "Vérifier" : "Check";
    var btnSpeak = document.createElement("button");
    btnSpeak.className="btn";
    btnSpeak.type="button";
    btnSpeak.textContent = "🔊";
    btnSpeak.addEventListener("click", function(){ speakNow(target); });

    var btnReset = document.createElement("button");
    btnReset.className="btn";
    btnReset.type="button";
    btnReset.textContent = state.lang==="FR" ? "Réinitialiser" : "Reset";

    var fb = document.createElement("div");
    fb.className="mini";
    fb.style.marginTop="8px";

    btnCheck.addEventListener("click", function(){
      var built = qsa(".builder__out .tile", box).map(function(t){ return t.textContent; }).join(" ");
      // Normalize spaces for p.m.
      var norm = built.replace(/\s+/g," ").trim().replace(" p.m."," p.m.");
      var ok = norm === target;
      if(ok){
        fb.textContent = state.lang==="FR" ? "✅ Super. Lis-la à voix haute !" : "✅ Great. Say it out loud!";
        addScore(3);
        speakNow(target);
      }else{
        fb.textContent = state.lang==="FR" ? "❌ Pas encore. Astuce : on / at." : "❌ Not yet. Hint: on / at.";
        addScore(0);
      }
    });

    btnReset.addEventListener("click", function(){
      out.innerHTML = "";
      renderBank();
      fb.textContent = "";
    });

    row.appendChild(btnCheck);
    row.appendChild(btnSpeak);
    row.appendChild(btnReset);

    box.appendChild(bank);
    box.appendChild(out);
    box.appendChild(row);
    box.appendChild(fb);

    renderBank();
  }

  function renderCreditWords(){
    var box = $("creditWords");
    if(!box) return;
    box.innerHTML = "";
    CREDIT_WORDS.forEach(function(pair){
      var a = document.createElement("div");
      a.className="well";
      a.style.margin="0 0 10px";
      a.innerHTML = "<div style='font-weight:800'>"+esc(pair[0])+"</div><div class='muted'>"+esc(pair[1])+"</div>"+
                    "<div class='row'><button class='btn' type='button'>🔊</button></div>";
      var b = qs("button", a);
      b.addEventListener("click", function(){ speakNow(pair[0] + ". " + pair[1]); });
      box.appendChild(a);
    });
  }

  /* -----------------------------
     Number drill
  ----------------------------- */
  var drillTimer = null;
  function startNumberDrill(){
    var box = $("numberDrillBox");
    if(!box) return;
    var samples = [
      { label:"Phone", value:"617-555-0123", say:"six one seven, five five five, zero one two three" },
      { label:"ZIP code", value:"02139", say:"zero two one three nine" },
      { label:"Amount", value:"$1,250", say:"one thousand two hundred fifty dollars" },
      { label:"Date", value:"03/12/2026", say:"March twelfth, twenty twenty-six" }
    ];
    var s = samples[Math.floor(Math.random()*samples.length)];
    box.innerHTML = "<div><strong>"+esc(s.label)+":</strong> <span class='mono'>"+esc(s.value)+"</span></div>"+
                    "<div class='muted'>"+(state.lang==="FR"?"Répète : ":"Repeat: ")+esc(s.say)+"</div>";
    speakNow(s.value);
    addScore(1);
  }

  /* -----------------------------
     MCQ
  ----------------------------- */
  function renderMCQ(containerId, questions){
    var box = $(containerId);
    if(!box) return;
    box.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className="quiz";

    questions.forEach(function(q, idx){
      var qBox = document.createElement("div");
      qBox.className="q";
      qBox.innerHTML = "<div><strong>"+(idx+1)+".</strong> "+esc(state.lang==="FR"?q.q_fr:q.q_en)+"</div>";
      var opts = document.createElement("div");
      opts.className="opts";

      (state.lang==="FR"?q.opts_fr:q.opts_en).forEach(function(opt, oi){
        var btn = document.createElement("button");
        btn.className="opt";
        btn.type="button";
        btn.textContent=opt;
        btn.addEventListener("click", function(){
          var isRight = (oi === q.correct);
          if(isRight){
            btn.classList.add("good");
            addScore(2);
            speakNow(opt);
          }else{
            btn.classList.add("bad");
            addScore(0);
          }
          // lock
          qsa(".opt", qBox).forEach(function(o){ o.disabled=true; });
        });
        opts.appendChild(btn);
      });

      var hint = document.createElement("div");
      hint.className="mini muted";
      hint.style.marginTop="8px";
      hint.textContent = state.lang==="FR" ? q.hint_fr : q.hint_en;

      qBox.appendChild(opts);
      qBox.appendChild(hint);
      wrap.appendChild(qBox);
    });

    box.appendChild(wrap);
  }

  var MCQ_BASICS = [
    {
      q_en:"What is the official place to request free credit reports?",
      q_fr:"Quel est le site officiel pour demander des credit reports gratuits ?",
      opts_en:["AnnualCreditReport.com","FreeCreditNow.com","MyBank.com"],
      opts_fr:["AnnualCreditReport.com","FreeCreditNow.com","MyBank.com"],
      correct:0,
      hint_en:"Tip: there is one authorized site for free reports.",
      hint_fr:"Astuce : il y a un seul site autorisé pour les reports gratuits."
    },
    {
      q_en:"What helps a credit score the most over time?",
      q_fr:"Qu’est-ce qui aide le plus un credit score sur la durée ?",
      opts_en:["Paying on time","Opening many cards fast","Maxing out the card"],
      opts_fr:["Payer à l’heure","Ouvrir beaucoup de cartes vite","Utiliser 100% du plafond"],
      correct:0,
      hint_en:"Payment history is a key factor.",
      hint_fr:"Le paiement à l’heure est un facteur clé."
    },
    {
      q_en:"What is a secured credit card?",
      q_fr:"Qu’est-ce qu’une carte sécurisée (secured) ?",
      opts_en:["A card with a refundable deposit","A prepaid gift card","A debit card"],
      opts_fr:["Une carte avec dépôt remboursable","Une carte cadeau prépayée","Une carte de débit"],
      correct:0,
      hint_en:"It works like a credit card but requires a deposit.",
      hint_fr:"Ça fonctionne comme une carte de crédit mais avec dépôt."
    }
  ];

  /* -----------------------------
     Matching (term -> definition)
  ----------------------------- */
  function renderMatching(containerId, pairs){
    var box = $(containerId);
    if(!box) return;
    box.innerHTML = "";

    var left = document.createElement("div");
    left.className = "match__col";
    var right = document.createElement("div");
    right.className = "match__col";

    var leftTitle = document.createElement("div");
    leftTitle.className="muted";
    leftTitle.style.marginBottom="8px";
    leftTitle.textContent = state.lang==="FR" ? "Termes" : "Terms";

    var rightTitle = document.createElement("div");
    rightTitle.className="muted";
    rightTitle.style.marginBottom="8px";
    rightTitle.textContent = state.lang==="FR" ? "Définitions" : "Definitions";

    left.appendChild(leftTitle);
    right.appendChild(rightTitle);

    var items = shuffle(pairs.map(function(p, i){
      return { id:"p"+i, term:p.term, def:p.def };
    }));
    var slots = shuffle(pairs.map(function(p, i){
      return { id:"p"+i, title:p.term, def:p.def };
    }));

    var pickedLeftId = null;

    function makeLeftItem(it){
      var d = document.createElement("div");
      d.className="match__item";
      d.textContent = it.term;
      d.setAttribute("data-id", it.id);
      d.setAttribute("draggable", state.tapMode ? "false" : "true");

      d.addEventListener("click", function(){
        if(!state.tapMode) return;
        // pick/unpick
        if(pickedLeftId === it.id){
          pickedLeftId = null;
          d.classList.remove("is-picked");
          d.style.outline="none";
          return;
        }
        // clear previous pick
        qsa(".match__item", left).forEach(function(x){ x.style.outline="none"; });
        pickedLeftId = it.id;
        d.style.outline = "2px solid rgba(102,217,255,.55)";
      });

      d.addEventListener("dragstart", function(e){
        if(state.tapMode) return;
        e.dataTransfer.setData("text/plain", it.id);
      });

      return d;
    }

    function makeSlot(s){
      var slot = document.createElement("div");
      slot.className="match__slot";
      slot.setAttribute("data-id", s.id);

      slot.innerHTML = "<div class='match__slotTitle'>"+esc(s.title)+"</div>"+
                       "<div class='match__slotMeta'>"+esc(s.def)+"</div>";

      function checkDrop(id){
        if(!id) return;
        var correct = (id === s.id);
        if(correct){
          slot.classList.remove("bad");
          slot.style.outline="2px solid rgba(100,255,218,.45)";
          addScore(2);
          // mark used item
          qsa(".match__item", left).forEach(function(li){
            if(li.getAttribute("data-id")===id){
              li.classList.add("good");
              li.setAttribute("draggable","false");
              li.style.pointerEvents="none";
              li.style.opacity=".75";
            }
          });
          speakNow(s.title + ". " + s.def);
        }else{
          slot.style.outline="2px solid rgba(255,92,122,.45)";
          addScore(0);
        }
        saveState();
      }

      // tap mode: click slot to place
      slot.addEventListener("click", function(){
        if(!state.tapMode) return;
        if(!pickedLeftId) return;
        checkDrop(pickedLeftId);
        pickedLeftId = null;
        qsa(".match__item", left).forEach(function(x){ x.style.outline="none"; });
      });

      slot.addEventListener("dragover", function(e){
        if(state.tapMode) return;
        e.preventDefault();
        slot.classList.add("is-over");
      });
      slot.addEventListener("dragleave", function(){
        slot.classList.remove("is-over");
      });
      slot.addEventListener("drop", function(e){
        if(state.tapMode) return;
        e.preventDefault();
        slot.classList.remove("is-over");
        var id = e.dataTransfer.getData("text/plain");
        checkDrop(id);
      });

      return slot;
    }

    items.forEach(function(it){ left.appendChild(makeLeftItem(it)); });
    slots.forEach(function(s){ right.appendChild(makeSlot(s)); });

    var wrap = document.createElement("div");
    wrap.className="match";
    wrap.appendChild(left);
    wrap.appendChild(right);

    box.appendChild(wrap);
  }

  /* -----------------------------
     Fill-in with word bank
  ----------------------------- */
  function renderFillBank(containerId){
    var box = $(containerId);
    if(!box) return;

    var sentence = state.lang==="FR"
      ? "Je voudrais mettre en place l’_____ pour payer automatiquement chaque mois."
      : "I’d like to set up _____ to pay automatically each month.";

    var bankWords = state.lang==="FR"
      ? ["autopay","deposit","screening","score"]
      : ["autopay","deposit","screening","score"];

    var correct = "autopay";

    box.innerHTML = "";
    var bank = document.createElement("div");
    bank.className="wordbank";

    var blank = document.createElement("div");
    blank.className="blank";
    blank.setAttribute("aria-label","Blank");

    var picked = null;

    function wordBtn(w){
      var b = document.createElement("button");
      b.className="tile";
      b.type="button";
      b.textContent=w;
      b.setAttribute("draggable", state.tapMode ? "false" : "true");

      b.addEventListener("click", function(){
        if(!state.tapMode) return;
        // pick
        qsa(".wordbank .tile", box).forEach(function(x){ x.classList.remove("is-picked"); });
        picked = w;
        b.classList.add("is-picked");
      });

      b.addEventListener("dragstart", function(e){
        if(state.tapMode) return;
        e.dataTransfer.setData("text/plain", w);
      });

      return b;
    }

    bankWords.forEach(function(w){ bank.appendChild(wordBtn(w)); });

    function place(w){
      blank.textContent = w;
      var ok = (w === correct);
      if(ok){
        blank.style.outline="2px solid rgba(100,255,218,.45)";
        addScore(2);
        speakNow(state.lang==="FR" ? "Autopay." : "Autopay.");
      }else{
        blank.style.outline="2px solid rgba(255,92,122,.45)";
        addScore(0);
      }
    }

    blank.addEventListener("click", function(){
      if(!state.tapMode) return;
      if(!picked) return;
      place(picked);
      picked = null;
      qsa(".wordbank .tile", box).forEach(function(x){ x.classList.remove("is-picked"); });
    });

    blank.addEventListener("dragover", function(e){
      if(state.tapMode) return;
      e.preventDefault();
      blank.classList.add("is-over");
    });
    blank.addEventListener("dragleave", function(){
      blank.classList.remove("is-over");
    });
    blank.addEventListener("drop", function(e){
      if(state.tapMode) return;
      e.preventDefault();
      blank.classList.remove("is-over");
      var w = e.dataTransfer.getData("text/plain");
      place(w);
    });

    var line = document.createElement("div");
    line.className="well";
    line.innerHTML = esc(sentence).replace("_____", "<span id='blankMount'></span>");

    var mount = document.createElement("span");
    mount.appendChild(blank);
    // replace placeholder span
    setTimeout(function(){
      var m = qs("#blankMount", line);
      if(m) m.replaceWith(mount);
    }, 0);

    var hint = document.createElement("div");
    hint.className="mini muted";
    hint.style.marginTop="8px";
    hint.textContent = state.lang==="FR"
      ? "Indice : c’est le paiement automatique."
      : "Hint: it means automatic payment.";

    box.appendChild(bank);
    box.appendChild(line);
    box.appendChild(hint);
  }

  /* -----------------------------
     Sentence order (reorder + buttons)
  ----------------------------- */
  function renderReorder(containerId){
    var box = $(containerId);
    if(!box) return;

    var target = state.lang==="FR"
      ? ["Bonjour, je vous appelle au sujet de ma demande.","Pouvez-vous confirmer les documents requis ?","Je peux envoyer mes relevés bancaires.","Merci beaucoup pour votre aide."]
      : ["Hi, I’m calling about my application.","Could you confirm the required documents?","I can email my bank statements.","Thank you very much for your help."];

    var current = shuffle(target);

    box.innerHTML = "";
    var list = document.createElement("div");
    list.className="reorder__list";

    function render(){
      list.innerHTML = "";
      current.forEach(function(line, idx){
        var row = document.createElement("div");
        row.className="reorder__item";

        var left = document.createElement("div");
        left.style.flex="1";
        left.textContent = line;

        var btns = document.createElement("div");
        btns.className="reorder__btns";

        var up = document.createElement("button");
        up.className="btn";
        up.type="button";
        up.textContent="↑";
        up.disabled = idx===0;
        up.addEventListener("click", function(){
          var t = current[idx-1];
          current[idx-1]=current[idx];
          current[idx]=t;
          render();
        });

        var down = document.createElement("button");
        down.className="btn";
        down.type="button";
        down.textContent="↓";
        down.disabled = idx===current.length-1;
        down.addEventListener("click", function(){
          var t2 = current[idx+1];
          current[idx+1]=current[idx];
          current[idx]=t2;
          render();
        });

        var sp = document.createElement("button");
        sp.className="btn";
        sp.type="button";
        sp.textContent="🔊";
        sp.addEventListener("click", function(){ speakNow(line); });

        btns.appendChild(up);
        btns.appendChild(down);
        btns.appendChild(sp);

        row.appendChild(left);
        row.appendChild(btns);
        list.appendChild(row);
      });
    }

    var row = document.createElement("div");
    row.className="row";

    var btnCheck = document.createElement("button");
    btnCheck.className="btn btn--primary";
    btnCheck.type="button";
    btnCheck.textContent = state.lang==="FR" ? "Vérifier" : "Check";

    var btnReset = document.createElement("button");
    btnReset.className="btn";
    btnReset.type="button";
    btnReset.textContent = state.lang==="FR" ? "Mélanger" : "Shuffle";

    var fb = document.createElement("div");
    fb.className="mini muted";
    fb.style.marginTop="8px";

    btnCheck.addEventListener("click", function(){
      var ok = current.join("|") === target.join("|");
      if(ok){
        fb.textContent = state.lang==="FR" ? "✅ Parfait. Fais l’appel à voix haute !" : "✅ Perfect. Do the call out loud!";
        addScore(3);
        speakNow(target.join(" "));
      }else{
        fb.textContent = state.lang==="FR" ? "❌ Pas encore. Mets d’abord l’objet de l’appel." : "❌ Not yet. Put the reason first.";
        addScore(0);
      }
    });

    btnReset.addEventListener("click", function(){
      current = shuffle(target);
      render();
      fb.textContent="";
    });

    row.appendChild(btnCheck);
    row.appendChild(btnReset);

    render();
    box.appendChild(list);
    box.appendChild(row);
    box.appendChild(fb);
  }

  /* -----------------------------
     True/False
  ----------------------------- */
  function renderTrueFalse(containerId){
    var box = $(containerId);
    if(!box) return;

    var items = [
      {
        en:"Paying the minimum on time is better than paying late.",
        fr:"Payer le minimum à l’heure vaut mieux que payer en retard.",
        a:true,
        hint_en:"On-time payments matter.",
        hint_fr:"Les paiements à l’heure comptent."
      },
      {
        en:"Using 100% of your credit limit helps your score.",
        fr:"Utiliser 100% du plafond aide le score.",
        a:false,
        hint_en:"High utilization usually hurts.",
        hint_fr:"Une utilisation élevée pénalise souvent."
      },
      {
        en:"A credit freeze is free in the U.S.",
        fr:"Le gel du dossier (freeze) est gratuit aux USA.",
        a:true,
        hint_en:"Yes, freezes are free.",
        hint_fr:"Oui, c’est gratuit."
      }
    ];

    box.innerHTML = "";
    items.forEach(function(it){
      var card = document.createElement("div");
      card.className="q";
      card.style.marginBottom="10px";
      card.innerHTML = "<div>"+esc(state.lang==="FR"?it.fr:it.en)+"</div>";

      var row = document.createElement("div");
      row.className="row";

      var t = document.createElement("button");
      t.className="btn";
      t.type="button";
      t.textContent = "True";

      var f = document.createElement("button");
      f.className="btn";
      f.type="button";
      f.textContent = "False";

      var hint = document.createElement("div");
      hint.className="mini muted";
      hint.style.marginTop="8px";
      hint.textContent = state.lang==="FR"?it.hint_fr:it.hint_en;

      function choose(val){
        var ok = (val===it.a);
        if(ok){ addScore(2); speakNow(state.lang==="FR"?"Correct.":"Correct."); }
        else { addScore(0); }
        t.disabled=true; f.disabled=true;
        (ok ? (val? t : f) : (val? t : f)).classList.add(ok ? "good":"bad");
      }

      t.addEventListener("click", function(){ choose(true); });
      f.addEventListener("click", function(){ choose(false); });

      row.appendChild(t);
      row.appendChild(f);
      card.appendChild(row);
      card.appendChild(hint);
      box.appendChild(card);
    });
  }

  /* -----------------------------
     Document pack buckets
  ----------------------------- */
  function renderDocPack(containerId){
    var box = $(containerId);
    if(!box) return;

    var docs = state.lang==="FR"
      ? [
        {id:"id", t:"Pièce d’identité (passeport)", bucket:"Identity"},
        {id:"income", t:"Preuve de revenus (pay stubs)", bucket:"Income"},
        {id:"bank", t:"Relevés bancaires", bucket:"Income"},
        {id:"ref", t:"Références / anciens propriétaires", bucket:"References"},
        {id:"ssn", t:"SSN / ITIN (si disponible)", bucket:"Identity"}
      ]
      : [
        {id:"id", t:"Photo ID (passport)", bucket:"Identity"},
        {id:"income", t:"Proof of income (pay stubs)", bucket:"Income"},
        {id:"bank", t:"Bank statements", bucket:"Income"},
        {id:"ref", t:"References / previous landlords", bucket:"References"},
        {id:"ssn", t:"SSN / ITIN (if available)", bucket:"Identity"}
      ];

    var buckets = [
      {id:"Identity", label: state.lang==="FR"?"Identité":"Identity"},
      {id:"Income", label: state.lang==="FR"?"Revenus":"Income"},
      {id:"References", label: state.lang==="FR"?"Références":"References"}
    ];

    box.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className="match";

    var left = document.createElement("div");
    left.className="match__col";
    left.innerHTML = "<div class='muted' style='margin-bottom:8px'>"+(state.lang==="FR"?"Documents":"Documents")+"</div>";

    var right = document.createElement("div");
    right.className="match__col";
    right.innerHTML = "<div class='muted' style='margin-bottom:8px'>"+(state.lang==="FR"?"Catégories":"Buckets")+"</div>";

    var picked = null;

    function makeDoc(d){
      var el = document.createElement("div");
      el.className="match__item";
      el.textContent = d.t;
      el.setAttribute("data-id", d.id);
      el.setAttribute("data-bucket", d.bucket);
      el.setAttribute("draggable", state.tapMode ? "false" : "true");

      el.addEventListener("click", function(){
        if(!state.tapMode) return;
        qsa(".match__item", left).forEach(function(x){ x.style.outline="none"; });
        picked = d;
        el.style.outline="2px solid rgba(102,217,255,.55)";
      });

      el.addEventListener("dragstart", function(e){
        if(state.tapMode) return;
        e.dataTransfer.setData("text/plain", d.id);
      });

      return el;
    }

    function check(bucketId, docObj){
      if(!docObj) return;
      var ok = docObj.bucket === bucketId;
      if(ok){
        addScore(2);
        speakNow(docObj.t);
        // disable
        qsa(".match__item", left).forEach(function(x){
          if(x.getAttribute("data-id")===docObj.id){
            x.style.opacity=".65";
            x.style.pointerEvents="none";
            x.style.outline="none";
            x.classList.add("good");
          }
        });
      }else{
        addScore(0);
      }
      picked = null;
      qsa(".match__item", left).forEach(function(x){ x.style.outline="none"; });
    }

    function makeBucket(b){
      var slot = document.createElement("div");
      slot.className="match__slot";
      slot.setAttribute("data-id", b.id);
      slot.innerHTML = "<div class='match__slotTitle'>"+esc(b.label)+"</div>"+
                       "<div class='match__slotMeta'>"+(state.lang==="FR"?"Dépose ici":"Drop here")+"</div>";

      slot.addEventListener("click", function(){
        if(!state.tapMode) return;
        if(!picked) return;
        check(b.id, picked);
      });

      slot.addEventListener("dragover", function(e){
        if(state.tapMode) return;
        e.preventDefault();
        slot.classList.add("is-over");
      });
      slot.addEventListener("dragleave", function(){
        slot.classList.remove("is-over");
      });
      slot.addEventListener("drop", function(e){
        if(state.tapMode) return;
        e.preventDefault();
        slot.classList.remove("is-over");
        var id = e.dataTransfer.getData("text/plain");
        var doc = null;
        for(var i=0;i<docs.length;i++){ if(docs[i].id===id){ doc=docs[i]; break; } }
        check(b.id, doc);
      });

      return slot;
    }

    docs.forEach(function(d){ left.appendChild(makeDoc(d)); });
    buckets.forEach(function(b){ right.appendChild(makeBucket(b)); });

    wrap.appendChild(left);
    wrap.appendChild(right);
    box.appendChild(wrap);

    var hint = document.createElement("div");
    hint.className="mini muted";
    hint.style.marginTop="8px";
    hint.textContent = state.lang==="FR"
      ? "Astuce : sur iPad, passe en mode Tap."
      : "Tip: on iPad, switch to Tap mode.";
    box.appendChild(hint);
  }

  /* -----------------------------
     Role-play dialogues
  ----------------------------- */
  function renderRoleplay(containerId, scene){
    var box = $(containerId);
    if(!box) return;
    box.innerHTML = "";

    var idx = 0;

    function renderTurn(){
      box.innerHTML = "";
      var t = scene[idx];

      var turn = document.createElement("div");
      turn.className="turn";
      turn.innerHTML = "<div class='who'>"+esc(t.who)+"</div>"+
                       "<div class='say'>"+esc(state.lang==="FR" ? (t.fr||t.en) : t.en)+"</div>";

      var actions = document.createElement("div");
      actions.className="actions";

      var listen = document.createElement("button");
      listen.className="btn";
      listen.type="button";
      listen.textContent="🔊 Listen";
      listen.addEventListener("click", function(){
        speakNow(state.lang==="FR" ? (t.fr||t.en) : t.en);
      });

      var next = document.createElement("button");
      next.className="btn btn--primary";
      next.type="button";
      next.textContent = idx < scene.length-1 ? "Next ▶" : "Restart ↺";
      next.addEventListener("click", function(){
        if(idx < scene.length-1) idx++;
        else idx = 0;
        addScore(1);
        renderTurn();
      });

      var prompt = document.createElement("button");
      prompt.className="btn";
      prompt.type="button";
      prompt.textContent="Your turn 🗣";
      prompt.addEventListener("click", function(){
        var p = state.lang==="FR" ? (t.prompt_fr||t.prompt_en) : (t.prompt_en||"Repeat the line.");
        speakNow(p);
      });

      actions.appendChild(listen);
      actions.appendChild(prompt);
      actions.appendChild(next);

      turn.appendChild(actions);
      box.appendChild(turn);

      var tip = document.createElement("div");
      tip.className="mini muted";
      tip.style.marginTop="8px";
      tip.textContent = state.lang==="FR"
        ? "Objectif : répéter la phrase, puis répondre avec vos infos."
        : "Goal: repeat the line, then answer with your info.";
      box.appendChild(tip);
    }

    renderTurn();
  }

  var RP_BANK = [
    { who:"Bank", en:"Hello! How can I help you today?", fr:"Bonjour ! Comment puis-je vous aider ?", prompt_en:"Say: Hi, I’d like to ask about a secured credit card.", prompt_fr:"Dites : Bonjour, je voudrais me renseigner sur une carte sécurisée." },
    { who:"You", en:"Hi, I’d like to ask about a secured credit card.", fr:"Bonjour, je voudrais me renseigner sur une carte sécurisée.", prompt_en:"Repeat the line.", prompt_fr:"Répétez la phrase." },
    { who:"Bank", en:"Do you have a Social Security Number or ITIN?", fr:"Avez-vous un Social Security Number ou ITIN ?", prompt_en:"Answer: Yes / Not yet, but I have my passport and address.", prompt_fr:"Répondez : Oui / Pas encore, mais j’ai mon passeport et mon adresse." },
    { who:"Bank", en:"Great. What credit limit would you like to start with?", fr:"Très bien. Quel plafond souhaitez-vous pour commencer ?", prompt_en:"Answer: I’d like to start with five hundred dollars.", prompt_fr:"Répondez : Je voudrais commencer avec 500 dollars." }
  ];

  var RP_UTILITY = [
    { who:"Utility", en:"Thanks for calling. Do you want to start service at your new address?", fr:"Merci d’appeler. Voulez-vous démarrer le service à votre nouvelle adresse ?", prompt_en:"Say: Yes, I’d like to start service on March 12.", prompt_fr:"Dites : Oui, je voudrais démarrer le 12 mars." },
    { who:"Utility", en:"We may require a deposit. Would you like autopay?", fr:"Il peut y avoir un dépôt. Souhaitez-vous l’autopay ?", prompt_en:"Answer: Yes, please. What is the deposit amount?", prompt_fr:"Répondez : Oui. Quel est le montant du dépôt ?" },
    { who:"Utility", en:"Your due date will be the 15th.", fr:"Votre échéance sera le 15.", prompt_en:"Repeat: The due date will be the 15th.", prompt_fr:"Répétez : La date d’échéance sera le 15." }
  ];

  var RP_LANDLORD = [
    { who:"Landlord", en:"We run a credit screening for all applicants.", fr:"Nous faisons une vérification de crédit pour tous les candidats.", prompt_en:"Say: Understood. My U.S. credit history is new.", prompt_fr:"Dites : D’accord. Mon historique de crédit américain est récent." },
    { who:"You", en:"Understood. My U.S. credit history is new. Could you accept extra documents?", fr:"D’accord. Mon historique américain est récent. Pouvez-vous accepter des documents en plus ?", prompt_en:"Repeat the line.", prompt_fr:"Répétez la phrase." },
    { who:"Landlord", en:"Possibly. Do you have proof of income and references?", fr:"Peut‑être. Avez-vous des preuves de revenus et des références ?", prompt_en:"Answer: Yes, I can provide both.", prompt_fr:"Répondez : Oui, je peux fournir les deux." },
    { who:"Landlord", en:"Okay. Please email them today.", fr:"D’accord. Merci de les envoyer par email aujourd’hui.", prompt_en:"Say: Thank you. I will send them today.", prompt_fr:"Dites : Merci. Je les envoie aujourd’hui." }
  ];

  /* -----------------------------
     Shadow mode
  ----------------------------- */
  function renderShadow(containerId){
    var box = $(containerId);
    if(!box) return;
    var model = state.lang==="FR"
      ? "Bonjour. Je vous appelle pour confirmer les documents requis. Je peux envoyer mes relevés bancaires et mes références. Merci beaucoup."
      : "Hi. I’m calling to confirm the required documents. I can email my bank statements and references. Thank you very much.";
    box.innerHTML = "";
    var m = document.createElement("div");
    m.className="shadow__model";
    m.innerHTML = "<div><strong>Model:</strong></div><div class='muted'>"+esc(model)+"</div>";
    var row = document.createElement("div");
    row.className="shadow__timer";

    var btnListen = document.createElement("button");
    btnListen.className="btn";
    btnListen.type="button";
    btnListen.textContent="🔊 Listen";
    btnListen.addEventListener("click", function(){ speakNow(model); });

    var btnStart = document.createElement("button");
    btnStart.className="btn btn--primary";
    btnStart.type="button";
    btnStart.textContent = state.lang==="FR" ? "Défi 30s ▶" : "30s challenge ▶";

    var timer = document.createElement("span");
    timer.className="badge badge--muted";
    timer.textContent="00:30";

    var tleft = 30;
    var interval = null;

    btnStart.addEventListener("click", function(){
      if(interval) return;
      tleft = 30;
      timer.textContent="00:30";
      interval = setInterval(function(){
        tleft--;
        timer.textContent = "00:" + (tleft<10?"0":"") + tleft;
        if(tleft<=0){
          clearInterval(interval);
          interval=null;
          addScore(5);
          speakNow(state.lang==="FR"?"Excellent.":"Excellent.");
        }
      }, 1000);
      speakNow(state.lang==="FR"?"Parlez maintenant.":"Speak now.");
    });

    var btnStop = document.createElement("button");
    btnStop.className="btn";
    btnStop.type="button";
    btnStop.textContent = state.lang==="FR" ? "Stop" : "Stop";
    btnStop.addEventListener("click", function(){
      if(interval){ clearInterval(interval); interval=null; }
      timer.textContent="00:30";
    });

    row.appendChild(btnListen);
    row.appendChild(btnStart);
    row.appendChild(btnStop);
    row.appendChild(timer);

    box.appendChild(m);
    box.appendChild(row);
  }

  /* -----------------------------
     Template composers
  ----------------------------- */
  function composer(containerId, cfg){
    var box = $(containerId);
    if(!box) return;
    box.innerHTML = "";

    var row = document.createElement("div");
    row.className="composer";

    var pick = document.createElement("div");
    pick.className="row2";

    function makeSelect(label, options){
      var wrap = document.createElement("div");
      wrap.innerHTML = "<div class='muted' style='margin-bottom:6px'>"+esc(label)+"</div>";
      var sel = document.createElement("select");
      sel.className="select";
      options.forEach(function(o){
        var op=document.createElement("option");
        op.value=o;
        op.textContent=o;
        sel.appendChild(op);
      });
      wrap.appendChild(sel);
      return {wrap:wrap, sel:sel};
    }

    var s1 = makeSelect(state.lang==="FR"?cfg.labels.fr1:cfg.labels.en1, state.lang==="FR"?cfg.opts.fr1:cfg.opts.en1);
    var s2 = makeSelect(state.lang==="FR"?cfg.labels.fr2:cfg.labels.en2, state.lang==="FR"?cfg.opts.fr2:cfg.opts.en2);

    pick.appendChild(s1.wrap);
    pick.appendChild(s2.wrap);

    var ta = document.createElement("textarea");
    ta.value = "";

    var actions = document.createElement("div");
    actions.className="row";

    var btnGen = document.createElement("button");
    btnGen.className="btn btn--primary";
    btnGen.type="button";
    btnGen.textContent = state.lang==="FR" ? "Générer" : "Generate";

    var btnCopy = document.createElement("button");
    btnCopy.className="btn";
    btnCopy.type="button";
    btnCopy.textContent = state.lang==="FR" ? "Copier" : "Copy";

    var btnSpeak = document.createElement("button");
    btnSpeak.className="btn";
    btnSpeak.type="button";
    btnSpeak.textContent = "🔊 Read";

    var fb = document.createElement("div");
    fb.className="mini muted";

    function build(){
      var a = s1.sel.value;
      var b = s2.sel.value;
      var msg = cfg.build(a,b,state.lang);
      ta.value = msg;
      addScore(2);
      saveState();
    }

    btnGen.addEventListener("click", build);
    btnCopy.addEventListener("click", function(){
      try{
        ta.select();
        document.execCommand("copy");
        fb.textContent = state.lang==="FR" ? "✅ Copié." : "✅ Copied.";
        addScore(1);
      }catch(e){
        fb.textContent = state.lang==="FR" ? "Sélectionnez et copiez manuellement." : "Select and copy manually.";
      }
    });
    btnSpeak.addEventListener("click", function(){ speakNow(ta.value || ""); });

    actions.appendChild(btnGen);
    actions.appendChild(btnCopy);
    actions.appendChild(btnSpeak);

    row.appendChild(pick);
    row.appendChild(ta);
    row.appendChild(actions);
    row.appendChild(fb);

    box.appendChild(row);

    build(); // initial
  }

  function renderTemplates(){
    composer("tplLandlord", {
      labels:{ en1:"Goal", fr1:"Objectif", en2:"Tone", fr2:"Ton" },
      opts:{
        en1:["Ask about screening", "Ask about alternatives (documents)", "Ask about co-signer / deposit"],
        fr1:["Demander le screening", "Demander des alternatives (documents)", "Demander garant / dépôt"],
        en2:["Very polite", "Friendly", "Short & direct"],
        fr2:["Très poli", "Sympa", "Court & direct"]
      },
      build:function(goal,tone,lang){
        var polite = (tone.indexOf("pol")>=0 || tone.indexOf("poli")>=0);
        var short = (tone.indexOf("Short")>=0 || tone.indexOf("Court")>=0);

        var hello = lang==="FR" ? "Hello," : "Hello,";
        var closing = lang==="FR" ? "Thank you very much.\nBest regards," : "Thank you very much.\nBest regards,";
        var core = "";

        if(lang==="FR"){
          if(goal.indexOf("screening")>=0){
            core = "Je vous écris au sujet de la location. Pourriez-vous me confirmer les étapes du screening (credit/background) et les documents requis ?";
          }else if(goal.indexOf("alternatives")>=0){
            core = "Mon historique de crédit américain est récent. Serait-il possible de fournir des documents complémentaires (preuves de revenus, relevés bancaires, références) ?";
          }else{
            core = "Est-ce qu’un dépôt plus élevé ou un garant (co-signer) pourrait faciliter ma candidature ?";
          }
          if(short) core = core.replace("Je vous écris au sujet de la location. ","");
        }else{
          if(goal.indexOf("screening")>=0){
            core = "I’m writing about the rental. Could you please confirm the screening steps and required documents?";
          }else if(goal.indexOf("alternatives")>=0){
            core = "My U.S. credit history is new. Would it be possible to provide additional documents (proof of income, bank statements, references)?";
          }else{
            core = "Would a higher deposit or a co-signer help with my application?";
          }
          if(short) core = core.replace("I’m writing about the rental. ","");
        }

        return hello+"\n\n"+core+"\n\n"+closing+"\n";
      }
    });

    composer("tplBank", {
      labels:{ en1:"Topic", fr1:"Sujet", en2:"Time", fr2:"Moment" },
      opts:{
        en1:["Secured credit card", "Autopay setup", "Credit limit increase (later)"],
        fr1:["Carte sécurisée", "Mise en place autopay", "Augmenter le plafond (plus tard)"],
        en2:["Today", "This week", "Next week"],
        fr2:["Aujourd’hui", "Cette semaine", "Semaine prochaine"]
      },
      build:function(topic, time, lang){
        if(lang==="FR"){
          return "Hello,\n\nJe souhaiterais des informations sur : "+topic+".\nSerait-il possible d’échanger "+String(time||"").toLowerCase()+" ?\n\nMerci beaucoup.\nBest regards,\n";
        }
        return "Hello,\n\nI’d like information about: "+topic+".\nWould it be possible to speak "+time.toLowerCase()+"?\n\nThank you very much.\nBest regards,\n";
      }
    });

    composer("tplRentReport", {
      labels:{ en1:"Question", fr1:"Question", en2:"Detail", fr2:"Détail" },
      opts:{
        en1:["Do you report rent payments?", "Can I add a co-signer?", "Can I provide extra proof?"],
        fr1:["Signalez-vous le loyer ?", "Puis-je ajouter un garant ?", "Puis-je fournir d’autres preuves ?"],
        en2:["Include my move-in date", "Include my phone number", "Include both"],
        fr2:["Ajouter ma date d’entrée", "Ajouter mon téléphone", "Ajouter les deux"]
      },
      build:function(q, d, lang){
        var extra = "";
        if(lang==="FR"){
          if(d.indexOf("date")>=0) extra += "\n- Move-in date: March 12, 2026";
          if(d.indexOf("télé")>=0 || d.indexOf("phone")>=0) extra += "\n- Phone: (___) ___‑____";
          return "Hello,\n\n"+(q.indexOf("loyer")>=0 ? "Est-ce que vos services permettent de signaler les paiements de loyer ?" : "J’ai une question : "+q)+"\n"+extra+"\n\nMerci.\nBest regards,\n";
        }else{
          if(d.indexOf("move")>=0) extra += "\n- Move-in date: March 12, 2026";
          if(d.indexOf("phone")>=0) extra += "\n- Phone: (___) ___‑____";
          return "Hello,\n\n"+(q.indexOf("report")>=0 ? "Do your services report rent payments?" : "I have a question: "+q)+"\n"+extra+"\n\nThank you.\nBest regards,\n";
        }
      }
    });
  }

  /* -----------------------------
     Print checklist
  ----------------------------- */
  function renderPrintChecklist(){
    var box = $("printChecklist");
    if(!box) return;
    var lines = [];
    lines.push(state.lang==="FR" ? "📌 Checklist crédit (à cocher) :" : "📌 Credit checklist (tick off):");
    Object.keys(CHECKLISTS).forEach(function(k){
      var title = k==="week1" ? "Week 1" : (k==="w2to6" ? "Weeks 2–6" : "Months 2–6");
      lines.push("");
      lines.push("— "+title+" —");
      CHECKLISTS[k].forEach(function(it){
        lines.push("[ ] " + (state.lang==="FR"?it.fr:it.en));
      });
    });
    lines.push("");
    lines.push(state.lang==="FR"
      ? "Phrases pro : Could you please… / Would it be possible to… / I can provide proof of income…"
      : "Pro phrases: Could you please… / Would it be possible to… / I can provide proof of income…");

    box.innerHTML = "<pre style='white-space:pre-wrap;margin:0;font-family:var(--mono)'>"+esc(lines.join("\n"))+"</pre>";
  }

  /* -----------------------------
     Tour
  ----------------------------- */
  function startTour(){
    var steps = [
      { id:"#quickstart", msgEN:"Start here: check off the plan. Speak the chips.", msgFR:"Commence ici : coche le plan. Entraîne les phrases." },
      { id:"#vocab", msgEN:"Flip 10 vocab cards. Use the voice buttons.", msgFR:"Retourne 10 cartes. Utilise les boutons voix." },
      { id:"#grammar", msgEN:"Do the polite upgrade + date builder.", msgFR:"Fais l’exercice politesse + phrase date." },
      { id:"#exercises", msgEN:"Complete matching and one fill-in.", msgFR:"Fais le matching et un fill-in." },
      { id:"#speaking", msgEN:"Do Role-play 1 and Shadow mode.", msgFR:"Fais le role-play 1 et le Shadow mode." },
      { id:"#templates", msgEN:"Generate one email and read it aloud.", msgFR:"Génère un email et lis-le à voix haute." }
    ];
    var i = 0;

    function go(){
      var s = steps[i];
      var el = qs(s.id);
      if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
      speakNow(state.lang==="FR" ? s.msgFR : s.msgEN);
      i++;
      if(i>=steps.length) i=0;
    }
    go();
  }

  /* -----------------------------
     Bind controls
  ----------------------------- */
  function bindControls(){
    if($("langEN")) $("langEN").addEventListener("click", function(){ state.lang="EN"; applyAll(); saveState(); });
    if($("langFR")) $("langFR").addEventListener("click", function(){ state.lang="FR"; applyAll(); saveState(); });

    if($("accentUS")) $("accentUS").addEventListener("click", function(){
      state.accent="en-US";
      $("accentUS").setAttribute("aria-pressed","true");
      $("accentUK").setAttribute("aria-pressed","false");
      saveState();
      refreshVoices();
    });
    if($("accentUK")) $("accentUK").addEventListener("click", function(){
      state.accent="en-GB";
      $("accentUS").setAttribute("aria-pressed","false");
      $("accentUK").setAttribute("aria-pressed","true");
      saveState();
      refreshVoices();
    });

    if($("modeDrag")) $("modeDrag").addEventListener("click", function(){
      state.tapMode=false;
      $("modeDrag").setAttribute("aria-pressed","true");
      $("modeTap").setAttribute("aria-pressed","false");
      applyAll(); saveState();
    });
    if($("modeTap")) $("modeTap").addEventListener("click", function(){
      state.tapMode=true;
      $("modeDrag").setAttribute("aria-pressed","false");
      $("modeTap").setAttribute("aria-pressed","true");
      applyAll(); saveState();
    });

    // Enable voice
    if($("btnEnableVoice")) $("btnEnableVoice").addEventListener("click", function(){
      enableVoice();
    });

    if($("btnTestVoice")) $("btnTestVoice").addEventListener("click", function(){
      if(!state.ttsUnlocked) enableVoice();
      speakNow(state.lang==="FR" ? "Test de voix. Bienvenue." : "Voice test. Welcome.");
    });

    if($("btnStopSpeaking")) $("btnStopSpeaking").addEventListener("click", stopSpeaking);

    // speak buttons with data-speak
    document.addEventListener("click", function(e){
      var t = e.target;
      if(!t) return;
      var txt = t.getAttribute && t.getAttribute("data-speak");
      if(!txt) return;
      if(!state.ttsUnlocked) state.ttsUnlocked = true;
      speakNow(txt);
    });

    if($("btnNumberDrill")) $("btnNumberDrill").addEventListener("click", function(){
      startNumberDrill();
    });

    if($("btnSpeakBridge")) $("btnSpeakBridge").addEventListener("click", function(){
      var lines = BRIDGE_LINES.map(function(l){ return state.lang==="FR"?l.fr:l.en; }).join(" ");
      speakNow(lines);
    });

    if($("btnBridgeRoleplay")) $("btnBridgeRoleplay").addEventListener("click", function(){
      var prompt = state.lang==="FR"
        ? "Je suis le propriétaire. Expliquez votre dossier en 20 secondes."
        : "I’m the landlord. Explain your application in 20 seconds.";
      speakNow(prompt);
      addScore(1);
    });

    if($("vocabSearch")) $("vocabSearch").addEventListener("input", function(){ renderCards(); });
    if($("vocabFilter")) $("vocabFilter").addEventListener("change", function(){ renderCards(); });

    if($("btnShuffleCards")) $("btnShuffleCards").addEventListener("click", function(){
      VOCAB = shuffle(VOCAB);
      renderCards();
      addScore(1);
    });

    if($("btnQuizMe")) $("btnQuizMe").addEventListener("click", function(){
      var pick = VOCAB[Math.floor(Math.random()*VOCAB.length)];
      var q = state.lang==="FR"
        ? "Définis : "+pick.term+"."
        : "Define: "+pick.term+".";
      speakNow(q);
      addScore(1);
    });

    if($("btnStartTour")) $("btnStartTour").addEventListener("click", function(){
      if(!state.ttsUnlocked) enableVoice();
      startTour();
      addScore(1);
    });

    if($("btnPrint")) $("btnPrint").addEventListener("click", function(){
      window.print();
    });

    if($("btnResetAll")) $("btnResetAll").addEventListener("click", function(){
      if(!confirm(state.lang==="FR" ? "Réinitialiser score et activités ?" : "Reset score and activities?")) return;
      localStorage.removeItem(KEY);
      state.score=0; state.streak=0; state.checklist={}; state.done={};
      setBadges(); applyAll(); saveState();
      stopSpeaking();
    });
  }

  /* -----------------------------
     Apply all
  ----------------------------- */
  function applyAll(){
    applyI18N();
    // pressed states
    if($("accentUS")) $("accentUS").setAttribute("aria-pressed", state.accent==="en-US"?"true":"false");
    if($("accentUK")) $("accentUK").setAttribute("aria-pressed", state.accent==="en-GB"?"true":"false");
    if($("modeDrag")) $("modeDrag").setAttribute("aria-pressed", state.tapMode ? "false":"true");
    if($("modeTap")) $("modeTap").setAttribute("aria-pressed", state.tapMode ? "true":"false");

    renderChecklist("checklistWeek1", CHECKLISTS.week1);
    renderChecklist("checklistWeeks2to6", CHECKLISTS.w2to6);
    renderChecklist("checklistMonths2to6", CHECKLISTS.m2to6);
    renderBridgeChips();

    renderVocabFilters();
    renderCards();

    renderUpgradeTask();
    renderDateBuilder();
    renderCreditWords();

    renderMCQ("mcqBasics", MCQ_BASICS);

    var matchPairs = [
      { term:"credit report", def: state.lang==="FR"?"historique de crédit":"history record of your credit" },
      { term:"credit score", def: state.lang==="FR"?"un chiffre résumé":"a summary number" },
      { term:"due date", def: state.lang==="FR"?"date limite de paiement":"payment deadline" },
      { term:"utilization", def: state.lang==="FR"?"part du plafond utilisé":"how much of the limit you use" }
    ];
    renderMatching("matchTerms", matchPairs);

    renderFillBank("fillBank");
    renderReorder("orderCall");
    renderTrueFalse("tfMyths");
    renderDocPack("docPack");

    renderRoleplay("rpBank", RP_BANK);
    renderRoleplay("rpUtility", RP_UTILITY);
    renderRoleplay("rpLandlord", RP_LANDLORD);
    renderShadow("shadowMode");

    renderTemplates();
    renderPrintChecklist();

    setBadges();
  }

  /* -----------------------------
     Init
  ----------------------------- */
  function init(){
    loadState();
    setBadges();
    setSaved(false);

    // initialize voice list
    if(Voice.supported){
      refreshVoices();
      if(typeof window.speechSynthesis.onvoiceschanged !== "undefined"){
        window.speechSynthesis.onvoiceschanged = function(){ refreshVoices(); };
      }
      // attempt warm-up (won't speak without gesture)
      setTimeout(refreshVoices, 150);
    }else{
      voiceBadge("Voice: not supported");
    }

    bindControls();
    applyAll();

    // Enable voice automatically if user previously unlocked
    if(state.ttsUnlocked){
      // no speaking here (some browsers block); just mark as ready
      refreshVoices();
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }

})();
