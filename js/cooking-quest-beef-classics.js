(function(){
  "use strict";

  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c];
    });
  }
  function norm(s){ return String(s||"").trim().replace(/\s+/g," "); }
  function shuffle(arr){
    var a = arr.slice();
    for (var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function shuffleNotSame(arr){
    var tries = 0;
    var out = shuffle(arr);
    while (tries < 10 && out.join("|") === arr.join("|")){
      out = shuffle(arr);
      tries++;
    }
    return out;
  }

  var LS_KEY = "speakeasy_cooking_beef_classics_v1";
  var state = { recipeId:"ct_beef_supper", selected:{}, customList:[], earned:{}, possible:0 };

  function loadState(){
    try{
      var raw = localStorage.getItem(LS_KEY);
      if(raw){
        var obj = JSON.parse(raw);
        if(obj && typeof obj === "object"){
          state = Object.assign(state, obj);
        }
      }
    }catch(e){}
  }
  function saveState(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
  }

  var voices = [];
  function collectVoices(){
    if(!("speechSynthesis" in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
  }
  function pickVoice(){
    var mode = $("voiceMode") ? $("voiceMode").value : "us";
    var want = mode === "uk" ? "en-GB" : "en-US";
    return voices.find(function(v){ return v && v.lang === want; })
        || voices.find(function(v){ return v && String(v.lang||"").indexOf("en")===0; })
        || null;
  }
  function speak(text){
    text = norm(text);
    if(!text) return;
    if(!("speechSynthesis" in window)) return;
    try{ window.speechSynthesis.cancel(); }catch(e){}
    var u = new SpeechSynthesisUtterance(text);
    var v = pickVoice();
    if(v) u.voice = v;
    var r = $("speechRate") ? parseFloat($("speechRate").value||"1") : 1;
    u.rate = isFinite(r) ? r : 1;
    window.speechSynthesis.speak(u);
  }
  function bindSpeechButtons(){
    document.body.addEventListener("click", function(e){
      var btn = e.target && e.target.closest ? e.target.closest(".listenBtn") : null;
      if(!btn) return;
      speak(btn.getAttribute("data-say")||"");
    });
  }

  function award(key){
    if(state.earned[key]) return false;
    state.earned[key]=true;
    saveState();
    return true;
  }
  function unawardPrefix(prefix){
    Object.keys(state.earned||{}).forEach(function(k){
      if(k.indexOf(prefix)===0) delete state.earned[k];
    });
    saveState();
  }
  function computeScore(){
    var score=0;
    Object.keys(state.earned||{}).forEach(function(k){
      var m = /__pts(\d+)$/.exec(k);
      score += m ? parseInt(m[1],10) : 1;
    });
    return score;
  }
  function renderScore(){
    var s = computeScore();
    ["scoreNow","scoreNow2"].forEach(function(id){ var el=$(id); if(el) el.textContent=String(s); });
    ["scorePossible","scorePossible2"].forEach(function(id){ var el=$(id); if(el) el.textContent=String(state.possible); });
  }

  var RECIPES = [
    {
      id:"ct_beef_supper", title:"Connecticut Beef Supper", emoji:"🥘", meal:"dinner", region:"New England (Connecticut)",
      desc:"A cozy oven-baked beef-and-potato supper — classic home cooking.",
      ingredients:[
        { key:"stew_beef", name:"stew beef", emoji:"🥩", note:"cut into cubes" },
        { key:"potatoes", name:"potatoes", emoji:"🥔", note:"peeled & sliced" },
        { key:"carrots", name:"carrots", emoji:"🥕", note:"sliced" },
        { key:"onion", name:"onion", emoji:"🧅", note:"chopped" },
        { key:"celery", name:"celery", emoji:"🥬", note:"optional" },
        { key:"cream_soup", name:"cream of mushroom soup", emoji:"🥣", note:"or cream soup" },
        { key:"tomato_paste", name:"tomato paste", emoji:"🍅", note:"for richness" },
        { key:"worcestershire", name:"Worcestershire sauce", emoji:"🧴", note:"a few splashes" },
        { key:"salt", name:"salt", emoji:"🧂", note:"to taste" },
        { key:"pepper", name:"black pepper", emoji:"🧂", note:"to taste" }
      ],
      steps:[
        "Preheat the oven and grease a casserole dish.",
        "Layer potatoes, carrots, onion, and beef in the dish.",
        "Mix cream soup + tomato paste + Worcestershire; pour over.",
        "Cover and bake until the beef is tender.",
        "Uncover at the end to brown slightly. Serve hot."
      ],
      history:[
        "A vintage-style casserole found in New England home-cooking collections: beef + potatoes baked slowly for a hearty family meal.",
        "Casseroles became popular for practicality: one dish, budget-friendly, and easy to feed a crowd.",
        "Tip: leftovers taste even better the next day!"
      ],
      say:"Connecticut Beef Supper. A cozy oven-baked beef and potato casserole. Great for dinner and leftovers."
    },
    {
      id:"meatloaf", title:"American Meatloaf", emoji:"🍞", meal:"dinner", region:"USA (comfort food)",
      desc:"A loaf of seasoned ground meat, baked and often glazed with ketchup.",
      ingredients:[
        { key:"ground_beef", name:"ground beef", emoji:"🥩", note:"or beef + pork" },
        { key:"breadcrumbs", name:"breadcrumbs", emoji:"🍞", note:"or crushed crackers" },
        { key:"egg", name:"egg", emoji:"🥚", note:"binder" },
        { key:"milk", name:"milk", emoji:"🥛", note:"or broth" },
        { key:"onion", name:"onion", emoji:"🧅", note:"finely chopped" },
        { key:"garlic", name:"garlic", emoji:"🧄", note:"optional" },
        { key:"ketchup", name:"ketchup", emoji:"🍅", note:"for glaze" },
        { key:"mustard", name:"mustard", emoji:"🌭", note:"for tang" },
        { key:"worcestershire", name:"Worcestershire sauce", emoji:"🧴", note:"adds umami" },
        { key:"salt", name:"salt", emoji:"🧂", note:"to taste" },
        { key:"pepper", name:"black pepper", emoji:"🧂", note:"to taste" }
      ],
      steps:[
        "Preheat the oven and line a pan or loaf tin.",
        "Mix ground beef, breadcrumbs, egg, milk, onion, and seasonings.",
        "Shape into a loaf (or press into a loaf tin).",
        "Spread ketchup glaze on top.",
        "Bake until cooked through, then rest before slicing."
      ],
      history:[
        "A modern American meatloaf recipe appears in the late 1870s and was originally served as a breakfast food.",
        "During the Great Depression, meatloaf helped families stretch meat by adding bread or crackers.",
        "Today it’s a classic comfort food, often with a tomato-based glaze."
      ],
      say:"American meatloaf. Seasoned ground beef baked into a loaf with a ketchup glaze. Classic comfort food."
    },
    {
      id:"corned_beef_hash", title:"Corned Beef Hash (Breakfast-Style)", emoji:"🍳", meal:"breakfast", region:"USA diners (often breakfast)",
      desc:"Chopped corned beef + potatoes + onions, crisped in a skillet — often served with eggs.",
      ingredients:[
        { key:"corned_beef", name:"corned beef", emoji:"🥩", note:"leftover or canned" },
        { key:"potatoes", name:"potatoes", emoji:"🥔", note:"diced" },
        { key:"onion", name:"onion", emoji:"🧅", note:"diced" },
        { key:"bell_pepper", name:"bell pepper", emoji:"🫑", note:"optional" },
        { key:"butter", name:"butter", emoji:"🧈", note:"or oil" },
        { key:"salt", name:"salt", emoji:"🧂", note:"to taste" },
        { key:"pepper", name:"black pepper", emoji:"🧂", note:"to taste" },
        { key:"hot_sauce", name:"hot sauce", emoji:"🌶️", note:"optional" },
        { key:"egg", name:"egg", emoji:"🥚", note:"serve on top" }
      ],
      steps:[
        "Heat butter or oil in a skillet.",
        "Cook potatoes until golden; add onion and pepper.",
        "Add corned beef and press down to crisp.",
        "Flip/stir to brown. Season and add hot sauce if you like.",
        "Serve with eggs and toast."
      ],
      history:[
        "Hash comes from French “hacher” (to chop): chopped meat + potatoes + onions.",
        "In the US, hash is often served for breakfast with eggs; canned corned beef hash became popular in wartime rationing.",
        "It’s also a great way to use leftovers — a ‘no-waste’ diner classic."
      ],
      say:"Corned beef hash. Chopped corned beef and potatoes crisped in a skillet, often served for breakfast with eggs."
    }
  ];

  var FR = {
    "stew beef":"le bœuf à mijoter","potatoes":"les pommes de terre","carrots":"les carottes","onion":"l’oignon","celery":"le céleri",
    "cream of mushroom soup":"la soupe à la crème de champignons","tomato paste":"le concentré de tomates","Worcestershire sauce":"la sauce Worcestershire",
    "salt":"le sel","black pepper":"le poivre noir","ground beef":"le bœuf haché","breadcrumbs":"la chapelure","egg":"l’œuf","milk":"le lait","garlic":"l’ail",
    "ketchup":"le ketchup","mustard":"la moutarde","corned beef":"le bœuf salé (corned beef)","bell pepper":"le poivron","butter":"le beurre","hot sauce":"la sauce piquante"
  };

  function currentRecipe(){
    return RECIPES.filter(function(r){return r.id===state.recipeId;})[0] || RECIPES[0];
  }
  function ensureSelectionDefaults(){
    var r=currentRecipe();
    if(!state.selected || typeof state.selected!=="object") state.selected={};
    var keys=r.ingredients.map(function(x){return x.key;});
    var any=keys.some(function(k){return !!state.selected[k];});
    if(!any){ keys.forEach(function(k){state.selected[k]=true;}); saveState(); }
  }

  var VOCAB = [
    { id:"a_produce", theme:"aisles", icon:"🥬", front:"produce section", back:"fresh fruits and vegetables", ex:"Where is the produce section?" },
    { id:"a_dairy", theme:"aisles", icon:"🧈", front:"dairy section", back:"milk, butter, yogurt, cheese", ex:"Is butter in the dairy section?" },
    { id:"a_frozen", theme:"aisles", icon:"🧊", front:"frozen section", back:"frozen foods and ice cream", ex:"Where can I find frozen peas?" },
    { id:"a_meat", theme:"aisles", icon:"🥩", front:"meat counter", back:"fresh meat; ask the butcher", ex:"Could I get 500 grams of ground beef?" },
    { id:"a_bakery", theme:"aisles", icon:"🥖", front:"bakery", back:"bread and baked goods", ex:"Where are the breadcrumbs?" },
    { id:"a_checkout", theme:"aisles", icon:"🧾", front:"checkout lane", back:"where you pay", ex:"Which lane is open?" },
    { id:"a_display", theme:"aisles", icon:"🏷️", front:"on display", back:"placed to attract attention (endcap)", ex:"These chips are on display today." },

    { id:"v_chop", theme:"actions", icon:"🔪", front:"to chop", back:"to cut into small pieces", ex:"Chop the onion finely." },
    { id:"v_slice", theme:"actions", icon:"🔪", front:"to slice", back:"to cut into thin pieces", ex:"Slice the potatoes." },
    { id:"v_mix", theme:"actions", icon:"🥣", front:"to mix", back:"to combine ingredients", ex:"Mix the meat and breadcrumbs." },
    { id:"v_bake", theme:"actions", icon:"🔥", front:"to bake", back:"to cook in the oven", ex:"Bake for 45 minutes." },
    { id:"v_fry", theme:"actions", icon:"🍳", front:"to fry", back:"to cook in a pan with oil", ex:"Fry the hash until crispy." },
    { id:"v_season", theme:"actions", icon:"🧂", front:"to season", back:"to add salt, pepper, spices", ex:"Season to taste." },

    { id:"c_coupon", theme:"checkout", icon:"🏷️", front:"coupon", back:"a voucher for a discount", ex:"Do you take coupons?" },
    { id:"c_discount", theme:"checkout", icon:"💸", front:"discount", back:"a reduced price", ex:"Is there a discount today?" },
    { id:"c_bagger", theme:"checkout", icon:"🛍️", front:"bagger", back:"person who packs groceries", ex:"A bagger can help pack your bags." },
    { id:"c_loyalty", theme:"checkout", icon:"💳", front:"loyalty card", back:"store card that gives deals", ex:"Do you have a loyalty card?" },
    { id:"c_cashier", theme:"checkout", icon:"🧑‍💼", front:"cashier", back:"person who scans items", ex:"The cashier scanned my items." },

    { id:"d_hearty", theme:"describing", icon:"🥘", front:"hearty", back:"filling and satisfying", ex:"This supper is very hearty." },
    { id:"d_crispy", theme:"describing", icon:"🍳", front:"crispy", back:"crunchy, browned", ex:"Make the hash crispy." },
    { id:"d_gently", theme:"describing", icon:"🫧", front:"gently", back:"in a careful, soft way (adverb)", ex:"Stir gently." },
    { id:"d_finelly", theme:"describing", icon:"🔪", front:"finely", back:"into very small pieces (adverb)", ex:"Chop the onion finely." },

    { id:"k_first", theme:"connectors", icon:"1️⃣", front:"first", back:"step 1", ex:"First, wash the vegetables." },
    { id:"k_then", theme:"connectors", icon:"➡️", front:"then", back:"next", ex:"Then, heat the pan." },
    { id:"k_after", theme:"connectors", icon:"⏱️", front:"after that", back:"later step", ex:"After that, add the sauce." },
    { id:"k_finally", theme:"connectors", icon:"🏁", front:"finally", back:"last step", ex:"Finally, serve and enjoy!" },

    { id:"u_trolley", theme:"ukus", icon:"🛒", uk:"trolley", us:"cart", ex:"In the US, we say cart." },
    { id:"u_queue", theme:"ukus", icon:"⏳", uk:"queue", us:"line", ex:"Wait in line / queue." },
    { id:"u_bag", theme:"ukus", icon:"🛍️", uk:"carrier bag", us:"shopping bag", ex:"Would you like a bag?" }
  ];

  function recipeIngredientCards(){
    var r=currentRecipe();
    return (r.ingredients||[]).map(function(it){
      var fr = FR[it.name] || "ingredient";
      return { id:"ri_"+it.key, theme:"ingredients", icon:it.emoji||"🧾",
        front:it.name, back: fr + (it.note ? " • " + it.note : ""),
        ex:"Excuse me, where can I find "+it.name+"?" };
    });
  }

  function renderRecipeCards(){
    var grid=$("recipeGrid"); if(!grid) return;
    grid.innerHTML="";
    RECIPES.forEach(function(r){
      var btn=document.createElement("button");
      btn.type="button";
      btn.className="panel recipeBtn";
      btn.dataset.recipe=r.id;
      btn.style.textAlign="left";
      btn.innerHTML =
        '<div style="display:flex;align-items:center;gap:.6rem;">' +
          '<div style="font-size:1.6rem;">'+esc(r.emoji)+'</div>' +
          '<div><div style="font-weight:850;font-size:1.05rem;">'+esc(r.title)+'</div>' +
          '<div class="subline" style="margin:.15rem 0 0;">'+esc(r.region)+' • '+esc(r.meal)+'</div></div>' +
        '</div>' +
        '<p class="subline" style="margin:.55rem 0 0;">'+esc(r.desc)+'</p>';
      if(r.id===state.recipeId){
        btn.style.borderColor="rgba(34,197,94,.7)";
        btn.style.boxShadow="0 0 0 3px rgba(34,197,94,.15)";
      }
      grid.appendChild(btn);
    });
  }

  function renderRecipeDetails(){
    var r=currentRecipe();
    ensureSelectionDefaults();
    if($("recipeTitle")) $("recipeTitle").textContent = r.emoji+" "+r.title;
    if($("recipeDesc")) $("recipeDesc").textContent = r.desc+" ("+r.region+")";
    if($("btnListenRecipe")) $("btnListenRecipe").setAttribute("data-say", r.say);

    var pick=$("ingredientsPicker");
    if(pick){
      pick.innerHTML="";
      r.ingredients.forEach(function(it){
        var pill=document.createElement("div");
        pill.className="pillItem"+(state.selected[it.key]?" selected":"");
        pill.dataset.ig=it.key;
        pill.innerHTML = '<span class="itemEmoji">'+esc(it.emoji)+'</span><strong>'+esc(it.name)+'</strong><span style="opacity:.85;color:var(--muted);font-size:.9rem;">'+esc(it.note||"")+'</span>';
        pick.appendChild(pill);
      });
    }

    var steps=$("recipeSteps");
    if(steps){
      steps.innerHTML="";
      r.steps.forEach(function(s){ var li=document.createElement("li"); li.textContent=s; steps.appendChild(li); });
    }

    var hist=$("recipeHistory");
    if(hist){
      hist.innerHTML="";
      r.history.forEach(function(b){
        var d=document.createElement("div");
        d.className="bullet";
        d.textContent=b;
        hist.appendChild(d);
      });
    }
    if($("btnListenHistory")) $("btnListenHistory").setAttribute("data-say", r.history.join(" "));
  }

  function bindRecipeHandlers(){
    var grid=$("recipeGrid"); if(!grid) return;
    grid.addEventListener("click", function(e){
      var btn = e.target && e.target.closest ? e.target.closest("[data-recipe]") : null;
      if(!btn) return;
      state.recipeId = btn.dataset.recipe;
      state.selected = {};
      saveState();
      renderRecipeCards();
      renderRecipeDetails();
      renderShoppingList();
      rebuildDynamic();
      speak("Great choice. " + currentRecipe().say);
    });
  }

  function bindIngredientPicker(){
    var pick=$("ingredientsPicker"); if(!pick) return;
    pick.addEventListener("click", function(e){
      var pill = e.target && e.target.closest ? e.target.closest("[data-ig]") : null;
      if(!pill) return;
      var key = pill.dataset.ig;
      state.selected[key] = !state.selected[key];
      saveState();
      renderRecipeDetails();
      renderShoppingList();
    });
  }

  function bindSelectClearButtons(){
    var allBtn=$("btnSelectAllIngredients");
    var clrBtn=$("btnClearIngredients");
    if(allBtn) allBtn.addEventListener("click", function(){
      currentRecipe().ingredients.forEach(function(it){ state.selected[it.key]=true; });
      saveState(); renderRecipeDetails(); renderShoppingList();
    });
    if(clrBtn) clrBtn.addEventListener("click", function(){
      currentRecipe().ingredients.forEach(function(it){ state.selected[it.key]=false; });
      saveState(); renderRecipeDetails(); renderShoppingList();
    });
  }

  function listItems(){
    var r=currentRecipe();
    var selected = r.ingredients.filter(function(it){ return !!state.selected[it.key]; });
    var custom = (state.customList||[]).map(function(t, idx){ return { key:"custom_"+idx, name:t, emoji:"📝", note:"custom" }; });
    return selected.concat(custom);
  }

  function renderShoppingList(){
    var box=$("shoppingList"); if(!box) return;
    var items=listItems();
    if(!items.length){
      box.innerHTML='<div class="callout callout--soft">Your list is empty. Select ingredients above or add a custom item.</div>';
      return;
    }
    box.innerHTML = items.map(function(it){
      var removable = String(it.key).indexOf("custom_")===0;
      return '<div class="itemRow"><div class="itemLeft"><span class="itemEmoji">'+esc(it.emoji||"🧾")+
        '</span><strong>'+esc(it.name)+'</strong>'+(it.note?'<span style="font-size:.9rem;opacity:.9"> — '+esc(it.note)+'</span>':'')+
        '</div>'+(removable?'<button class="btn btn--ghost" type="button" data-remove="'+esc(it.key)+'">Remove</button>':'<span class="pill pill--mini">selected</span>')+'</div>';
    }).join("");
  }

  function bindShoppingListHandlers(){
    var box=$("shoppingList"); if(!box) return;
    box.addEventListener("click", function(e){
      var btn=e.target && e.target.closest ? e.target.closest("button[data-remove]") : null;
      if(!btn) return;
      var idx=parseInt(btn.getAttribute("data-remove").replace("custom_",""),10);
      if(!isNaN(idx)){
        state.customList.splice(idx,1);
        saveState();
        renderShoppingList();
        rebuildDynamic();
      }
    });
  }

  function bindListControls(){
    var add=$("btnAddCustom"), inp=$("customItem");
    if(add) add.addEventListener("click", function(){
      var val=norm(inp && inp.value);
      if(!val) return;
      state.customList = state.customList || [];
      state.customList.push(val);
      if(inp) inp.value="";
      saveState();
      renderShoppingList();
      rebuildDynamic();
    });
    if(inp) inp.addEventListener("keydown", function(e){ if(e.key==="Enter") $("btnAddCustom").click(); });
    var clr=$("btnClearList");
    if(clr) clr.addEventListener("click", function(){
      state.customList=[];
      saveState();
      renderShoppingList();
      rebuildDynamic();
    });
  }

  var tapPicked=null;
  function clearPicked(){ if(tapPicked){ tapPicked.classList.remove("picked"); tapPicked=null; } }
  function enableTapPick(tile){
    if(tapPicked===tile){ clearPicked(); return; }
    clearPicked(); tapPicked=tile; tile.classList.add("picked");
  }
  function makeDraggable(el){
    el.setAttribute("draggable","true");
    el.addEventListener("dragstart", function(e){
      try{ e.dataTransfer.setData("text/plain", el.dataset.value || el.textContent); }catch(err){}
      if(e.dataTransfer) e.dataTransfer.effectAllowed="move";
    });
  }

  function vocabForTheme(){
    var theme = $("vocabTheme") ? $("vocabTheme").value : "ingredients";
    var mode  = $("vocabMode") ? $("vocabMode").value : "en";

    if(mode !== "en"){
      return VOCAB.filter(function(v){return v.theme==="ukus";}).map(function(v){
        return { id:v.id, theme:"ukus", icon:v.icon, front:v.uk+" (UK)", back:v.us+" (US)", ex:v.ex };
      });
    }

    var base = VOCAB.slice();
    var recipeCards = recipeIngredientCards();
    var recipeNames = {};
    recipeCards.forEach(function(c){ recipeNames[String(c.front||"").toLowerCase()]=true; });

    var list = base;
    if(theme !== "all"){ list = list.filter(function(v){ return v.theme === theme; }); }

    var wantRecipe = (theme==="ingredients" || theme==="all");
    if(wantRecipe){
      list = list.filter(function(v){
        if(v.theme!=="ingredients") return true;
        return !recipeNames[String(v.front||"").toLowerCase()];
      });
    }

    var mapped = list.map(function(v){
      if(v.theme==="ukus"){
        return { id:v.id, icon:v.icon, theme:"ukus", front:v.us+" (US) / "+v.uk+" (UK)", back:v.us+" ↔ "+v.uk, ex:v.ex };
      }
      return v;
    });

    if(wantRecipe) mapped = recipeCards.concat(mapped);
    return mapped;
  }

  function renderVocab(){
    var grid=$("vocabGrid"); if(!grid) return;
    var cards=vocabForTheme();
    grid.innerHTML = cards.map(function(c){
      return '<div class="vcard" tabindex="0" data-card="'+esc(c.id)+'">'+
        '<div class="face front">'+
          '<div class="vicon">'+esc(c.icon||"🧾")+'</div>'+
          '<div class="vfront">'+esc(c.front)+'</div>'+
          '<div class="vex">'+esc(c.ex||"")+'</div>'+
          '<div class="vtools">'+
            '<button class="btn btn--ghost listenBtn" type="button" data-say="'+esc(c.front)+'. '+esc(c.ex||"")+'">▶ Listen</button>'+
            '<button class="btn btn--ghost" type="button" data-flip="1">Flip</button>'+
          '</div>'+
        '</div>'+
        '<div class="face back">'+
          '<div class="vicon">📌</div>'+
          '<div class="vfront">'+esc(c.front)+'</div>'+
          '<div class="vback">'+esc(c.back||"")+'</div>'+
          '<div class="vtools"><button class="btn btn--ghost" type="button" data-flip="1">Flip back</button></div>'+
        '</div>'+
      '</div>';
    }).join("");
  }

  function bindVocabHandlers(){
    var grid=$("vocabGrid"); if(!grid) return;
    grid.addEventListener("pointerup", function(e){
      var t=e.target;
      if(!t) return;
      if(t.closest && t.closest(".listenBtn")) return;
      var flip = t.closest && t.closest("button[data-flip]");
      if(flip){
        var card=flip.closest(".vcard");
        if(card) card.classList.toggle("is-flipped");
        return;
      }
      var vcard = t.closest && t.closest(".vcard");
      if(vcard) vcard.classList.toggle("is-flipped");
    });
    grid.addEventListener("keydown", function(e){
      if(e.key!=="Enter") return;
      var vcard = e.target && e.target.classList && e.target.classList.contains("vcard") ? e.target : null;
      if(vcard) vcard.classList.toggle("is-flipped");
    });
  }

  function bindVocabControls(){
    var theme=$("vocabTheme"), mode=$("vocabMode"), shuf=$("btnShuffleCards");
    if(theme) theme.addEventListener("change", renderVocab);
    if(mode)  mode.addEventListener("change", renderVocab);
    if(shuf)  shuf.addEventListener("click", renderVocab);
  }

  /* ---- Activities (same as earlier design) ---- */
  function renderStoreMatch(){
    var box=$("storeMatch"); if(!box) return;
    var prefix="storeMatch__";
    var pts=6;
    state.possible += pts;

    var pairs=[
      { item:"ground beef", cat:"butcher / meat counter" },
      { item:"corned beef", cat:"deli counter" },
      { item:"potatoes", cat:"produce section" },
      { item:"milk", cat:"dairy section" },
      { item:"breadcrumbs", cat:"bakery / bread aisle" },
      { item:"hot sauce", cat:"international / condiments aisle" }
    ];
    var items=shuffleNotSame(pairs.map(function(p){return p.item;}));
    var cats=["produce section","dairy section","butcher / meat counter","deli counter","bakery / bread aisle","international / condiments aisle"];

    box.innerHTML =
      '<h3>Match: where should you buy it?</h3>'+
      '<p class="subline">Drag (or tap) an item into the best store place.</p>'+
      '<div class="tileTray" id="sm_tiles"></div>'+
      '<div class="dropGrid" id="sm_bins" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:.8rem;"></div>'+
      '<div class="minirow"><div class="points" id="sm_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="sm_check">Check</button>'+
        '<button class="btn btn--ghost" type="button" id="sm_hint">Hint</button>'+
        '<button class="btn btn--ghost" type="button" id="sm_reset">Reset</button></div>'+
      '<div class="fb" id="sm_fb" aria-live="polite"></div>';

    var tray=$("sm_tiles"), bins=$("sm_bins"), fb=$("sm_fb");

    function tileElByValue(val){
      var all=box.querySelectorAll(".tile");
      for(var i=0;i<all.length;i++) if(all[i].dataset.value===val) return all[i];
      return null;
    }
    function move(val, cat){
      var el=tileElByValue(val);
      var area=bins.querySelector('[data-cat="'+cat+'"] .binArea');
      if(area && el) area.appendChild(el);
    }
    function makeBin(dz){
      dz.addEventListener("dragover", function(e){ e.preventDefault(); if(e.dataTransfer) e.dataTransfer.dropEffect="move"; });
      dz.addEventListener("drop", function(e){
        e.preventDefault();
        var data="";
        try{ data=e.dataTransfer.getData("text/plain"); }catch(err){}
        data=norm(data);
        if(!data) return;
        move(data, dz.dataset.cat);
        clearPicked();
      });
      dz.addEventListener("click", function(){
        if(!tapPicked) return;
        move(tapPicked.dataset.value, dz.dataset.cat);
        clearPicked();
      });
    }

    items.forEach(function(name){
      var t=document.createElement("div");
      t.className="tile";
      t.dataset.value=name;
      t.dataset.correctCat = pairs.filter(function(p){return p.item===name;})[0].cat;
      t.textContent=name;
      makeDraggable(t);
      t.addEventListener("click", function(){ enableTapPick(t); });
      tray.appendChild(t);
    });

    cats.forEach(function(c){
      var dz=document.createElement("div");
      dz.className="dropZone";
      dz.dataset.cat=c;
      dz.style.flexDirection="column";
      dz.style.alignItems="stretch";
      dz.innerHTML='<div class="dzLabel">'+esc(c)+'</div><div class="binArea" style="margin-top:.45rem;min-height:65px;display:flex;flex-wrap:wrap;gap:.5rem;"></div>';
      bins.appendChild(dz);
      makeBin(dz);
    });

    function hint(){ fb.className="fb"; fb.textContent="Tip: corned beef is often sliced at the deli; ground beef is at the meat counter."; }
    function check(){
      var all=box.querySelectorAll(".tile");
      var placed=0, ok=0;
      for(var i=0;i<all.length;i++){
        var t=all[i];
        var inBin=!!t.closest(".binArea");
        if(inBin) placed++;
        var cat=t.closest(".dropZone") ? t.closest(".dropZone").dataset.cat : "";
        var good=inBin && cat===t.dataset.correctCat;
        t.classList.remove("good","bad");
        if(inBin) t.classList.add(good?"good":"bad");
        if(good) ok++;
      }
      if(placed!==items.length){ fb.className="fb bad"; fb.textContent="Place all items first ("+placed+" / "+items.length+")."; return; }
      if(ok===items.length){
        var got=award(prefix+"ok__pts"+pts);
        fb.className="fb good"; fb.textContent= got ? ("✅ Perfect! +"+pts+" pts.") : "✅ Correct — already counted.";
        $("sm_pts").textContent=pts+" pts";
      }else{
        fb.className="fb bad"; fb.textContent="Not yet: "+ok+" / "+items.length+" correct. Fix the red tiles.";
      }
      renderScore();
    }
    function reset(){ unawardPrefix(prefix); renderStoreMatch(); renderScore(); }

    $("sm_check").addEventListener("click", check);
    $("sm_hint").addEventListener("click", hint);
    $("sm_reset").addEventListener("click", reset);
    $("sm_pts").textContent = state.earned[prefix+"ok__pts"+pts] ? (pts+" pts") : "0 pts";
  }

  function renderAisleSort(){
    var box=$("aisleSort"); if(!box) return;
    var prefix="aisleSort__";
    var pts=6;
    state.possible += pts;

    var cfg={
      title:"Sort foods into the right section",
      subtitle:"Only 3 categories: Produce • Frozen section • Dairy section.",
      categories:["Produce section","Frozen section","Dairy section"],
      items:[
        { item:"apples", cat:"Produce section" },
        { item:"carrots", cat:"Produce section" },
        { item:"ice cream", cat:"Frozen section" },
        { item:"frozen peas", cat:"Frozen section" },
        { item:"milk", cat:"Dairy section" },
        { item:"yogurt", cat:"Dairy section" }
      ]
    };
    var tiles=shuffleNotSame(cfg.items.map(function(x){return x.item;}));

    box.innerHTML =
      '<h3>Drag & drop (or tap): '+esc(cfg.title)+'</h3>'+
      '<p class="subline">'+esc(cfg.subtitle)+'</p>'+
      '<div class="tileTray" id="as_tiles"></div>'+
      '<div class="dropGrid" id="as_bins" style="grid-template-columns:repeat(3,minmax(0,1fr));margin-top:.8rem;"></div>'+
      '<div class="minirow"><div class="points" id="as_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="as_check">Check</button>'+
        '<button class="btn btn--ghost" type="button" id="as_hint">Hint</button>'+
        '<button class="btn btn--ghost" type="button" id="as_reset">Reset</button></div>'+
      '<div class="fb" id="as_fb" aria-live="polite"></div>';

    var tray=$("as_tiles"), bins=$("as_bins"), fb=$("as_fb");

    function tileElByValue(val){
      var all=box.querySelectorAll(".tile");
      for(var i=0;i<all.length;i++) if(all[i].dataset.value===val) return all[i];
      return null;
    }
    function move(val, cat){
      var el=tileElByValue(val);
      var area=bins.querySelector('[data-cat="'+cat+'"] .binArea');
      if(area && el) area.appendChild(el);
    }
    function makeBin(dz){
      dz.addEventListener("dragover", function(e){ e.preventDefault(); if(e.dataTransfer) e.dataTransfer.dropEffect="move"; });
      dz.addEventListener("drop", function(e){
        e.preventDefault();
        var data="";
        try{ data=e.dataTransfer.getData("text/plain"); }catch(err){}
        data=norm(data);
        if(!data) return;
        move(data, dz.dataset.cat);
        clearPicked();
      });
      dz.addEventListener("click", function(){
        if(!tapPicked) return;
        move(tapPicked.dataset.value, dz.dataset.cat);
        clearPicked();
      });
    }

    tiles.forEach(function(w){
      var t=document.createElement("div");
      t.className="tile";
      t.dataset.value=w;
      t.dataset.correctCat = cfg.items.filter(function(x){return x.item===w;})[0].cat;
      t.textContent=w;
      makeDraggable(t);
      t.addEventListener("click", function(){ enableTapPick(t); });
      tray.appendChild(t);
    });

    cfg.categories.forEach(function(c){
      var dz=document.createElement("div");
      dz.className="dropZone";
      dz.dataset.cat=c;
      dz.style.flexDirection="column";
      dz.style.alignItems="stretch";
      dz.innerHTML='<div class="dzLabel">'+esc(c)+'</div><div class="binArea" style="margin-top:.45rem;min-height:70px;display:flex;flex-wrap:wrap;gap:.5rem;"></div>';
      bins.appendChild(dz);
      makeBin(dz);
    });

    function hint(){ fb.className="fb"; fb.textContent="Tip: milk/yogurt = dairy. ice cream/peas = frozen. apples/carrots = produce."; }
    function check(){
      var all=box.querySelectorAll(".tile");
      var placed=0, ok=0;
      for(var i=0;i<all.length;i++){
        var t=all[i];
        var inBin=!!t.closest(".binArea");
        if(inBin) placed++;
        var cat=t.closest(".dropZone") ? t.closest(".dropZone").dataset.cat : "";
        var good=inBin && cat===t.dataset.correctCat;
        t.classList.remove("good","bad");
        if(inBin) t.classList.add(good?"good":"bad");
        if(good) ok++;
      }
      if(placed!==tiles.length){ fb.className="fb bad"; fb.textContent="Place all items first ("+placed+" / "+tiles.length+")."; return; }
      if(ok===tiles.length){
        var got=award(prefix+"ok__pts"+pts);
        fb.className="fb good"; fb.textContent= got ? ("✅ Perfect! +"+pts+" pts.") : "✅ Correct — already counted.";
        $("as_pts").textContent=pts+" pts";
      }else{
        fb.className="fb bad"; fb.textContent="Not yet: "+ok+" / "+tiles.length+" correct. Fix the red tiles.";
      }
      renderScore();
    }
    function reset(){ unawardPrefix(prefix); renderAisleSort(); renderScore(); }
    $("as_check").addEventListener("click", check);
    $("as_hint").addEventListener("click", hint);
    $("as_reset").addEventListener("click", reset);
    $("as_pts").textContent = state.earned[prefix+"ok__pts"+pts] ? (pts+" pts") : "0 pts";
  }

  function renderSentenceOrder(){
    var box=$("directionsOrder"); if(!box) return;
    var prefix="directionsOrder__";
    var pts=6; state.possible+=pts;

    var sentences=[
      { key:"s1", title:"Ask where something is (polite)", answer:"Excuse me, where can I find the breadcrumbs?", hint:"Start with 'Excuse me' then the question.", say:"Excuse me, where can I find the breadcrumbs?" },
      { key:"s2", title:"Follow directions in the store", answer:"Go straight ahead, then turn left at the dairy section.", hint:"Imperatives: Go… then Turn…", say:"Go straight ahead, then turn left at the dairy section." },
      { key:"s3", title:"Ask which aisle", answer:"Which aisle is the Worcestershire sauce in?", hint:"Which aisle… in?", say:"Which aisle is the Worcestershire sauce in?" }
    ];

    box.innerHTML =
      '<h3>Sentence builder: directions & questions</h3>'+
      '<p class="subline">Build each sentence in the ANSWER area. Drag tiles OR tap a tile then tap the answer area.</p>'+
      '<div id="so_blocks"></div>'+
      '<div class="minirow" style="margin-top:.65rem;"><div class="points" id="so_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="so_reset">Reset</button></div>';

    var blocks=$("so_blocks");

    function renderOne(s){
      var correct=s.answer;
      var words=correct.split(" ").filter(Boolean);
      var tiles=shuffleNotSame(words);
      var id="so_"+s.key;
      var ptsThis=2;

      var div=document.createElement("div");
      div.className="qRow";
      div.innerHTML =
        '<div class="q">'+esc(s.title)+'</div>'+
        '<div class="tileTray" id="'+esc(id)+'_tiles"></div>'+
        '<div class="answerTray" id="'+esc(id)+'_ans"></div>'+
        '<div class="minirow" style="margin-top:.45rem;">'+
          '<button class="btn btn--ghost" type="button" id="'+esc(id)+'_check">Check</button>'+
          '<button class="btn btn--ghost" type="button" id="'+esc(id)+'_hint">Hint</button>'+
          '<button class="btn btn--ghost listenBtn" type="button" data-say="'+esc(s.say)+'">▶ Listen</button>'+
          '<button class="btn btn--ghost" type="button" id="'+esc(id)+'_undo">Undo</button>'+
          '<button class="btn btn--ghost" type="button" id="'+esc(id)+'_clear">Clear</button>'+
        '</div>'+
        '<div class="fb" id="'+esc(id)+'_fb" aria-live="polite"></div>';
      blocks.appendChild(div);

      var tray=$(id+"_tiles"), ans=$(id+"_ans"), fb=$(id+"_fb");

      function setTileEnabled(val, enabled){
        var tnodes=tray.querySelectorAll(".tile");
        for(var i=0;i<tnodes.length;i++){
          if(tnodes[i].dataset.value===val){
            tnodes[i].style.opacity = enabled ? "1":"0.45";
            tnodes[i].style.pointerEvents = enabled ? "auto":"none";
            break;
          }
        }
      }
      function placedValues(){
        var kids=ans.querySelectorAll(".tile.placed");
        var out=[];
        for(var i=0;i<kids.length;i++) out.push(kids[i].dataset.value||"");
        return out;
      }
      function placeWord(val){
        if(!val) return;
        if(placedValues().indexOf(val)!==-1) return;
        var t=document.createElement("div");
        t.className="tile placed";
        t.dataset.value=val;
        t.textContent=val;
        t.title="Tap to remove";
        makeDraggable(t);
        t.addEventListener("click", function(){
          ans.removeChild(t);
          setTileEnabled(val,true);
          ans.classList.remove("good","bad");
          fb.className="fb"; fb.textContent="";
          clearPicked();
        });
        ans.appendChild(t);
        setTileEnabled(val,false);
        ans.classList.remove("good","bad");
      }

      ans.addEventListener("dragover", function(e){ e.preventDefault(); if(e.dataTransfer) e.dataTransfer.dropEffect="move"; });
      ans.addEventListener("drop", function(e){
        e.preventDefault();
        var data="";
        try{ data=e.dataTransfer.getData("text/plain"); }catch(err){}
        data=norm(data);
        placeWord(data);
        clearPicked();
      });
      ans.addEventListener("click", function(){
        if(!tapPicked) return;
        placeWord(tapPicked.dataset.value);
        clearPicked();
      });

      tiles.forEach(function(w){
        var tile=document.createElement("div");
        tile.className="tile";
        tile.dataset.value=w;
        tile.textContent=w;
        makeDraggable(tile);
        tile.addEventListener("click", function(){ enableTapPick(tile); });
        tray.appendChild(tile);
      });

      function check(){
        var built=norm(placedValues().join(" "));
        if(!built){ fb.className="fb"; fb.textContent="Add tiles to the answer area first."; return; }
        if(built===norm(correct)){
          ans.classList.remove("bad"); ans.classList.add("good");
          var got=award(prefix+s.key+"__pts"+ptsThis);
          fb.className="fb good";
          fb.textContent= got ? ("✅ Perfect! +"+ptsThis+" pts.") : "✅ Correct — already counted.";
        }else{
          ans.classList.remove("good"); ans.classList.add("bad");
          fb.className="fb bad";
          fb.textContent="❌ Not yet. Hint: "+s.hint;
        }
        renderSoPoints(); renderScore();
      }
      function hint(){ fb.className="fb"; fb.textContent=s.hint; }
      function undo(){
        var kids=ans.querySelectorAll(".tile.placed");
        if(!kids.length) return;
        var last=kids[kids.length-1];
        var val=last.dataset.value;
        ans.removeChild(last);
        setTileEnabled(val,true);
        ans.classList.remove("good","bad");
        fb.className="fb"; fb.textContent="";
      }
      function clearAll(){
        var kids=ans.querySelectorAll(".tile.placed");
        for(var i=kids.length-1;i>=0;i--){
          var val=kids[i].dataset.value;
          ans.removeChild(kids[i]);
          setTileEnabled(val,true);
        }
        ans.classList.remove("good","bad");
        fb.className="fb"; fb.textContent="";
      }

      $(id+"_check").addEventListener("click", check);
      $(id+"_hint").addEventListener("click", hint);
      $(id+"_undo").addEventListener("click", undo);
      $(id+"_clear").addEventListener("click", clearAll);
    }

    sentences.forEach(renderOne);

    function renderSoPoints(){
      var total=0;
      sentences.forEach(function(s){ if(state.earned[prefix+s.key+"__pts2"]) total+=2; });
      $("so_pts").textContent = total ? (total+" pts") : "0 pts";
    }

    function reset(){ unawardPrefix(prefix); renderSentenceOrder(); renderScore(); }
    $("so_reset").addEventListener("click", reset);
    renderSoPoints();
  }

  function renderDiscountSign(){
    var box=$("discountSign"); if(!box) return;
    var prefix="discountSign__";
    var pts=4; state.possible+=pts;

    var correct=["TODAY ONLY","SAVE 20%","ON GROUND BEEF"];
    var tiles=shuffleNotSame(["TODAY","ONLY","SAVE","20%","ON","GROUND","BEEF","LIMIT","2"]);

    box.innerHTML =
      "<h3>Make a store sign: today's discount</h3>"+
      "<p class='subline'>Build the sign lines in the right order. (Drag OR tap.)</p>"+
      "<div class='tileTray' id='ds_tiles'></div>"+
      "<div class='panel' style='margin-top:.8rem'>"+
        "<div class='subline' style='margin:.2rem 0 .55rem;'>Your sign</div>"+
        "<div class='answerTray' id='ds_line1'></div>"+
        "<div class='answerTray' id='ds_line2'></div>"+
        "<div class='answerTray' id='ds_line3'></div>"+
      "</div>"+
      "<div class='minirow' style='margin-top:.65rem'><div class='points' id='ds_pts'>0 pts</div>"+
        "<button class='btn btn--ghost' type='button' id='ds_check'>Check</button>"+
        "<button class='btn btn--ghost' type='button' id='ds_hint'>Hint</button>"+
        "<button class='btn btn--ghost listenBtn' type='button' data-say='Today only. Save twenty percent on ground beef.'>▶ Listen</button>"+
        "<button class='btn btn--ghost' type='button' id='ds_clear'>Clear</button>"+
        "<button class='btn btn--ghost' type='button' id='ds_reset'>Reset</button></div>"+
      "<div class='fb' id='ds_fb' aria-live='polite'></div>";

    var tray=$("ds_tiles");
    var lines=[$("ds_line1"),$("ds_line2"),$("ds_line3")];
    var fb=$("ds_fb");

    tiles.forEach(function(w){
      var t=document.createElement("div");
      t.className="tile";
      t.dataset.value=w;
      t.textContent=w;
      makeDraggable(t);
      t.addEventListener("click", function(){ enableTapPick(t); });
      tray.appendChild(t);
    });

    function setTileEnabled(val, enabled){
      var all=tray.querySelectorAll(".tile");
      for(var i=0;i<all.length;i++){
        if(all[i].dataset.value===val){
          all[i].style.opacity = enabled ? "1":"0.45";
          all[i].style.pointerEvents = enabled ? "auto":"none";
          break;
        }
      }
    }
    function lineWords(lineEl){
      var kids=lineEl.querySelectorAll(".tile.placed");
      var arr=[];
      for(var i=0;i<kids.length;i++) arr.push(kids[i].dataset.value);
      return arr;
    }
    function place(lineEl, val){
      if(!val) return;
      if(box.querySelectorAll('.tile.placed[data-value="'+val+'"]').length) return;
      var t=document.createElement("div");
      t.className="tile placed";
      t.dataset.value=val;
      t.textContent=val;
      makeDraggable(t);
      t.title="Tap to remove";
      t.addEventListener("click", function(){
        lineEl.removeChild(t);
        setTileEnabled(val,true);
        clearPicked();
      });
      lineEl.appendChild(t);
      setTileEnabled(val,false);
    }
    function makeLine(lineEl){
      lineEl.addEventListener("dragover", function(e){ e.preventDefault(); if(e.dataTransfer) e.dataTransfer.dropEffect="move"; });
      lineEl.addEventListener("drop", function(e){
        e.preventDefault();
        var data="";
        try{ data=e.dataTransfer.getData("text/plain"); }catch(err){}
        data=norm(data);
        place(lineEl,data);
        clearPicked();
      });
      lineEl.addEventListener("click", function(){
        if(!tapPicked) return;
        place(lineEl, tapPicked.dataset.value);
        clearPicked();
      });
    }
    lines.forEach(makeLine);

    function builtLine(i){ return norm(lineWords(lines[i]).join(" ")); }

    function clearAll(){
      lines.forEach(function(l){
        var kids=l.querySelectorAll(".tile.placed");
        for(var i=kids.length-1;i>=0;i--){
          var val=kids[i].dataset.value;
          l.removeChild(kids[i]);
          setTileEnabled(val,true);
        }
      });
      fb.className="fb"; fb.textContent="";
    }
    function hint(){
      fb.className="fb";
      fb.textContent="Hint: Line 1 = TODAY ONLY. Line 2 = SAVE 20%. Line 3 = ON GROUND BEEF.";
    }
    function check(){
      var l1=builtLine(0), l2=builtLine(1), l3=builtLine(2);
      if(!l1 || !l2 || !l3){ fb.className="fb bad"; fb.textContent="Fill all 3 lines first."; return; }
      var ok = (l1===correct[0] && l2===correct[1] && l3===correct[2]);
      if(ok){
        var got=award(prefix+"ok__pts"+pts);
        fb.className="fb good";
        fb.textContent= got ? ("✅ Great sign! +"+pts+" pts.") : "✅ Correct — already counted.";
        $("ds_pts").textContent=pts+" pts";
      }else{
        fb.className="fb bad";
        fb.textContent="❌ Not yet. Use the hint and check word order.";
      }
      renderScore();
    }
    function reset(){ unawardPrefix(prefix); renderDiscountSign(); renderScore(); }

    $("ds_check").addEventListener("click", check);
    $("ds_hint").addEventListener("click", hint);
    $("ds_clear").addEventListener("click", clearAll);
    $("ds_reset").addEventListener("click", reset);
    $("ds_pts").textContent = state.earned[prefix+"ok__pts"+pts] ? (pts+" pts") : "0 pts";
  }

  function renderCheckoutMCQ(){
    var box=$("checkoutMCQ"); if(!box) return;
    var prefix="checkoutMCQ__";
    var pts=6; state.possible+=pts;

    var qs=[
      { q:"You want to pay by card. What do you say?", a:"Can I pay by card, please?", opts:["Can I pay with cash only?","Can I pay by card, please?","Do you sell cards here?"], hint:"At checkout: pay by card / credit card." },
      { q:"The cashier asks about bags. What is natural?", a:"Could I have a bag, please?", opts:["Could I have a bag, please?","Could I have a table, please?","Could I have a recipe, please?"], hint:"Bag = shopping bag / carrier bag." },
      { q:"You want to use a coupon. What do you ask?", a:"Do you take coupons?", opts:["Where is the dairy section?","Do you have discounts tomorrow?","Do you take coupons?"], hint:"Coupon = discount voucher." }
    ];

    box.innerHTML =
      '<h3>Checkout: choose the best sentence</h3>'+
      '<p class="subline">Instant feedback after each answer.</p>'+
      '<div id="cmq"></div>'+
      '<div class="minirow" style="margin-top:.65rem;"><div class="points" id="cmq_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="cmq_reset">Reset</button></div>';

    var root=$("cmq"); root.innerHTML="";

    qs.forEach(function(q,i){
      var row=document.createElement("div");
      row.className="qRow";
      row.innerHTML =
        '<div class="q">'+esc((i+1)+". "+q.q)+'</div>'+
        '<div class="opts"></div>'+
        '<div class="fb" id="cmq_fb_'+i+'" aria-live="polite"></div>'+
        '<div class="minirow" style="margin-top:.45rem">'+
          '<button class="btn btn--ghost" type="button" id="cmq_hint_'+i+'">Hint</button>'+
          '<button class="btn btn--ghost listenBtn" type="button" data-say="'+esc(q.a)+'">▶ Listen correct</button>'+
        '</div>';
      var opts=row.querySelector(".opts");
      q.opts = shuffleNotSame(q.opts);
      q.opts.forEach(function(opt){
        var b=document.createElement("button");
        b.type="button";
        b.className="optBtn";
        b.textContent=opt;
        b.addEventListener("click", function(){
          var fb=$("cmq_fb_"+i);
          if(opt===q.a){
            b.classList.add("good");
            var got=award(prefix+"q"+i+"__pts2");
            fb.className="fb good";
            fb.textContent= got ? "✅ Correct! +2 pts." : "✅ Correct — already counted.";
          }else{
            b.classList.add("bad");
            fb.className="fb bad";
            fb.textContent="❌ Not quite. Hint: "+q.hint;
          }
          renderPts(); renderScore();
        });
        opts.appendChild(b);
      });
      row.querySelector("#cmq_hint_"+i).addEventListener("click", function(){
        var fb=$("cmq_fb_"+i); fb.className="fb"; fb.textContent=q.hint;
      });
      root.appendChild(row);
    });

    function renderPts(){
      var total=0;
      for(var i=0;i<qs.length;i++) if(state.earned[prefix+"q"+i+"__pts2"]) total+=2;
      $("cmq_pts").textContent = total ? (total+" pts") : "0 pts";
    }
    function reset(){ unawardPrefix(prefix); renderCheckoutMCQ(); renderScore(); }
    $("cmq_reset").addEventListener("click", reset);
    renderPts();
  }

  function renderPrepositions(){
    var box=$("gPrepositions"); if(!box) return;
    var prefix="gPrep__";
    var pts=4; state.possible+=pts;

    var bank=["on","in","at","under","next to"];
    var correct=["on","next to"];

    box.innerHTML =
      '<h3>Prepositions: on / in / at / next to</h3>'+
      '<div class="callout callout--info"><strong>Mini-lesson:</strong> We use <em>on</em> display, <em>in</em> the aisle, <em>at</em> the meat counter, and <em>next to</em> the checkout.</div>'+
      '<p class="subline">Fill the blanks with the best prepositions.</p>'+
      '<div class="qRow"><div class="q">The ketchup is ____ display, right ____ the checkout lanes.</div>'+
        '<div class="minirow"><select id="prep1"></select><select id="prep2"></select>'+
          '<button class="btn btn--ghost" type="button" id="prep_check">Check</button>'+
          '<button class="btn btn--ghost" type="button" id="prep_hint">Hint</button>'+
          '<button class="btn btn--ghost" type="button" id="prep_reset">Reset</button></div>'+
        '<div class="fb" id="prep_fb" aria-live="polite"></div></div>'+
      '<div class="points" id="prep_pts">0 pts</div>';

    function fill(id){
      var s=$(id);
      s.innerHTML = '<option value="">—</option>'+bank.map(function(w){return '<option value="'+esc(w)+'">'+esc(w)+'</option>';}).join("");
    }
    fill("prep1"); fill("prep2");

    function hint(){ $("prep_fb").className="fb"; $("prep_fb").textContent="Hint: 'on display' is a fixed phrase. Checkout lanes = lines, so 'next to'."; }
    function check(){
      var a1=$("prep1").value, a2=$("prep2").value;
      if(!a1||!a2){ $("prep_fb").className="fb bad"; $("prep_fb").textContent="Choose 2 prepositions."; return; }
      if(a1===correct[0] && a2===correct[1]){
        var got=award(prefix+"ok__pts"+pts);
        $("prep_fb").className="fb good";
        $("prep_fb").textContent= got ? ("✅ Perfect! +"+pts+" pts.") : "✅ Correct — already counted.";
        $("prep_pts").textContent=pts+" pts";
      }else{
        $("prep_fb").className="fb bad";
        $("prep_fb").textContent="❌ Not yet. Read the mini-lesson and try again.";
      }
      renderScore();
    }
    function reset(){ unawardPrefix(prefix); renderPrepositions(); renderScore(); }

    $("prep_check").addEventListener("click", check);
    $("prep_hint").addEventListener("click", hint);
    $("prep_reset").addEventListener("click", reset);
    $("prep_pts").textContent = state.earned[prefix+"ok__pts"+pts] ? (pts+" pts") : "0 pts";
  }

  function renderVerbTenses(){
    var box=$("gVerbTenses"); if(!box) return;
    var prefix="gTense__";
    var pts=6; state.possible+=pts;

    var qs=[
      { q:"Yesterday, I ____ (buy) potatoes.", a:"bought", opts:["buy","bought","will buy"], hint:"Past simple for yesterday." },
      { q:"Right now, I ____ (mix) the meat.", a:"am mixing", opts:["mix","am mixing","mixed"], hint:"Present continuous for now." },
      { q:"Next weekend, I ____ (make) meatloaf again.", a:"will make", opts:["made","will make","am making"], hint:"Future: will." }
    ];

    box.innerHTML =
      '<h3>Verb tenses: past / present continuous / future</h3>'+
      '<div class="callout callout--info"><strong>Mini-lesson:</strong> <em>Yesterday</em> → past (bought). <em>Right now</em> → am mixing. <em>Next weekend</em> → will make.</div>'+
      '<div id="tenseQ"></div>'+
      '<div class="minirow" style="margin-top:.65rem;"><div class="points" id="tense_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="tense_reset">Reset</button></div>';

    var root=$("tenseQ"); root.innerHTML="";

    qs.forEach(function(q,i){
      var row=document.createElement("div");
      row.className="qRow";
      row.innerHTML =
        '<div class="q">'+esc((i+1)+". "+q.q)+'</div>'+
        '<div class="opts"></div>'+
        '<div class="fb" id="tense_fb_'+i+'" aria-live="polite"></div>'+
        '<div class="minirow" style="margin-top:.45rem">'+
          '<button class="btn btn--ghost" type="button" id="tense_hint_'+i+'">Hint</button>'+
          '<button class="btn btn--ghost listenBtn" type="button" data-say="'+esc(q.q.replace("____", q.a))+'">▶ Listen correct</button></div>';
      var opts=row.querySelector(".opts");
      q.opts = shuffleNotSame(q.opts);
      q.opts.forEach(function(opt){
        var b=document.createElement("button");
        b.type="button";
        b.className="optBtn";
        b.textContent=opt;
        b.addEventListener("click", function(){
          var fb=$("tense_fb_"+i);
          if(opt===q.a){
            b.classList.add("good");
            var got=award(prefix+"q"+i+"__pts2");
            fb.className="fb good";
            fb.textContent= got ? "✅ Correct! +2 pts." : "✅ Correct — already counted.";
          }else{
            b.classList.add("bad");
            fb.className="fb bad";
            fb.textContent="❌ Not quite. Hint: "+q.hint;
          }
          renderPts(); renderScore();
        });
        opts.appendChild(b);
      });
      row.querySelector("#tense_hint_"+i).addEventListener("click", function(){
        var fb=$("tense_fb_"+i); fb.className="fb"; fb.textContent=q.hint;
      });
      root.appendChild(row);
    });

    function renderPts(){
      var total=0;
      for(var i=0;i<qs.length;i++) if(state.earned[prefix+"q"+i+"__pts2"]) total+=2;
      $("tense_pts").textContent = total ? (total+" pts") : "0 pts";
    }
    function reset(){ unawardPrefix(prefix); renderVerbTenses(); renderScore(); }
    $("tense_reset").addEventListener("click", reset);
    renderPts();
  }

  function renderAdjAdv(){
    var box=$("gAdjAdv"); if(!box) return;
    var prefix="gAdjAdv__";
    var pts=6; state.possible+=pts;

    var words=[
      { w:"hearty", type:"Adjective" },{ w:"crispy", type:"Adjective" },{ w:"gently", type:"Adverb" },
      { w:"finely", type:"Adverb" },{ w:"tender", type:"Adjective" },{ w:"quickly", type:"Adverb" }
    ];
    var tiles=shuffleNotSame(words.map(function(x){return x.w;}));
    var cats=["Adjective","Adverb"];

    box.innerHTML =
      '<h3>Adjectives vs adverbs</h3>'+
      '<div class="callout callout--info"><strong>Mini-lesson:</strong> Adjectives describe nouns (a <em>crispy</em> hash). Adverbs describe verbs (stir <em>gently</em>).</div>'+
      '<p class="subline">Sort the words.</p>'+
      '<div class="tileTray" id="aa_tiles"></div>'+
      '<div class="dropGrid" id="aa_bins" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:.8rem;"></div>'+
      '<div class="minirow"><div class="points" id="aa_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="aa_check">Check</button>'+
        '<button class="btn btn--ghost" type="button" id="aa_hint">Hint</button>'+
        '<button class="btn btn--ghost" type="button" id="aa_reset">Reset</button></div>'+
      '<div class="fb" id="aa_fb" aria-live="polite"></div>';

    var tray=$("aa_tiles"), bins=$("aa_bins"), fb=$("aa_fb");

    function tileElByValue(val){
      var all=box.querySelectorAll(".tile");
      for(var i=0;i<all.length;i++) if(all[i].dataset.value===val) return all[i];
      return null;
    }
    function move(val, cat){
      var el=tileElByValue(val);
      var area=bins.querySelector('[data-cat="'+cat+'"] .binArea');
      if(area && el) area.appendChild(el);
    }
    function makeBin(dz){
      dz.addEventListener("dragover", function(e){ e.preventDefault(); if(e.dataTransfer) e.dataTransfer.dropEffect="move"; });
      dz.addEventListener("drop", function(e){
        e.preventDefault();
        var data="";
        try{ data=e.dataTransfer.getData("text/plain"); }catch(err){}
        data=norm(data);
        if(!data) return;
        move(data, dz.dataset.cat);
        clearPicked();
      });
      dz.addEventListener("click", function(){
        if(!tapPicked) return;
        move(tapPicked.dataset.value, dz.dataset.cat);
        clearPicked();
      });
    }

    tiles.forEach(function(w){
      var t=document.createElement("div");
      t.className="tile";
      t.dataset.value=w;
      t.dataset.correctCat = words.filter(function(x){return x.w===w;})[0].type;
      t.textContent=w;
      makeDraggable(t);
      t.addEventListener("click", function(){ enableTapPick(t); });
      tray.appendChild(t);
    });

    cats.forEach(function(c){
      var dz=document.createElement("div");
      dz.className="dropZone";
      dz.dataset.cat=c;
      dz.style.flexDirection="column";
      dz.style.alignItems="stretch";
      dz.innerHTML='<div class="dzLabel">'+esc(c)+'</div><div class="binArea" style="margin-top:.45rem;min-height:70px;display:flex;flex-wrap:wrap;gap:.5rem;"></div>';
      bins.appendChild(dz);
      makeBin(dz);
    });

    function hint(){ fb.className="fb"; fb.textContent="Hint: many adverbs end in -ly (gently, finely, quickly)."; }
    function check(){
      var all=box.querySelectorAll(".tile");
      var placed=0, ok=0;
      for(var i=0;i<all.length;i++){
        var t=all[i];
        var inBin=!!t.closest(".binArea");
        if(inBin) placed++;
        var cat=t.closest(".dropZone") ? t.closest(".dropZone").dataset.cat : "";
        var good=inBin && cat===t.dataset.correctCat;
        t.classList.remove("good","bad");
        if(inBin) t.classList.add(good?"good":"bad");
        if(good) ok++;
      }
      if(placed!==tiles.length){ fb.className="fb bad"; fb.textContent="Place all words first ("+placed+" / "+tiles.length+")."; return; }
      if(ok===tiles.length){
        var got=award(prefix+"ok__pts"+pts);
        fb.className="fb good";
        fb.textContent= got ? ("✅ Perfect! +"+pts+" pts.") : "✅ Correct — already counted.";
        $("aa_pts").textContent=pts+" pts";
      }else{
        fb.className="fb bad";
        fb.textContent="Not yet: "+ok+" / "+tiles.length+" correct. Fix the red tiles.";
      }
      renderScore();
    }
    function reset(){ unawardPrefix(prefix); renderAdjAdv(); renderScore(); }

    $("aa_check").addEventListener("click", check);
    $("aa_hint").addEventListener("click", hint);
    $("aa_reset").addEventListener("click", reset);
    $("aa_pts").textContent = state.earned[prefix+"ok__pts"+pts] ? (pts+" pts") : "0 pts";
  }

  function renderComparatives(){
    var box=$("gComparatives"); if(!box) return;
    var prefix="gComp__";
    var pts=6; state.possible+=pts;

    var qs=[
      { q:"This meatloaf is ____ than the last one.", a:"juicier", opts:["juicy","juicier","juiciest"], hint:"Comparative: -er." },
      { q:"Corned beef hash is often the ____ meal of the day in diners.", a:"first", opts:["first","more first","firstest"], hint:"We say 'the first' meal, not 'firstest'." },
      { q:"This aisle is the ____ (wide) in the store.", a:"widest", opts:["wide","wider","widest"], hint:"Superlative: the widest." }
    ];

    box.innerHTML =
      '<h3>Comparatives & superlatives</h3>'+
      '<div class="callout callout--info"><strong>Mini-lesson:</strong> Comparative: <em>tastier than</em>. Superlative: <em>the tastiest</em>.</div>'+
      '<div id="compQ"></div>'+
      '<div class="minirow" style="margin-top:.65rem;"><div class="points" id="comp_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="comp_reset">Reset</button></div>';

    var root=$("compQ"); root.innerHTML="";

    qs.forEach(function(q,i){
      var row=document.createElement("div");
      row.className="qRow";
      row.innerHTML =
        '<div class="q">'+esc((i+1)+". "+q.q)+'</div>'+
        '<div class="opts"></div>'+
        '<div class="fb" id="comp_fb_'+i+'" aria-live="polite"></div>'+
        '<div class="minirow" style="margin-top:.45rem">'+
          '<button class="btn btn--ghost" type="button" id="comp_hint_'+i+'">Hint</button>'+
          '<button class="btn btn--ghost listenBtn" type="button" data-say="'+esc(q.q.replace("____", q.a))+'">▶ Listen correct</button></div>';
      var opts=row.querySelector(".opts");
      q.opts = shuffleNotSame(q.opts);
      q.opts.forEach(function(opt){
        var b=document.createElement("button");
        b.type="button";
        b.className="optBtn";
        b.textContent=opt;
        b.addEventListener("click", function(){
          var fb=$("comp_fb_"+i);
          if(opt===q.a){
            b.classList.add("good");
            var got=award(prefix+"q"+i+"__pts2");
            fb.className="fb good";
            fb.textContent= got ? "✅ Correct! +2 pts." : "✅ Correct — already counted.";
          }else{
            b.classList.add("bad");
            fb.className="fb bad";
            fb.textContent="❌ Not quite. Hint: "+q.hint;
          }
          renderPts(); renderScore();
        });
        opts.appendChild(b);
      });
      row.querySelector("#comp_hint_"+i).addEventListener("click", function(){
        var fb=$("comp_fb_"+i); fb.className="fb"; fb.textContent=q.hint;
      });
      root.appendChild(row);
    });

    function renderPts(){
      var total=0;
      for(var i=0;i<qs.length;i++) if(state.earned[prefix+"q"+i+"__pts2"]) total+=2;
      $("comp_pts").textContent = total ? (total+" pts") : "0 pts";
    }
    function reset(){ unawardPrefix(prefix); renderComparatives(); renderScore(); }
    $("comp_reset").addEventListener("click", reset);
    renderPts();
  }

  function renderDialogues(){
    var box=$("dialogues"); if(!box) return;
    var prefix="dlg__";
    var pts=6; state.possible+=pts;

    var cards=[
      { id:"d1", title:"At the store: asking for help", prompt:"You can’t find breadcrumbs. What do you say?",
        best:"Excuse me, where can I find the breadcrumbs?",
        choices:["Where is bread?","Excuse me, where can I find the breadcrumbs?","Give me breadcrumbs."],
        hint:"Use ‘Excuse me…’ + ‘Where can I find…?’" },
      { id:"d2", title:"At checkout: bags", prompt:"You want a bag.",
        best:"Could I have a bag, please?",
        choices:["Could I have a bag, please?","I want bag now.","Where is the bag aisle?"],
        hint:"Polite request: Could I… please?" },
      { id:"d3", title:"At checkout: coupon", prompt:"You want to use a coupon.",
        best:"Do you take coupons?",
        choices:["Do you take coupons?","Do you take carrots?","Do you take cooking?"],
        hint:"Coupon = discount voucher." }
    ];

    box.innerHTML =
      '<h3>Mini-dialogues</h3>'+
      '<p class="subline">Choose the best response. Listen and repeat.</p>'+
      '<div id="dlg_cards"></div>'+
      '<div class="minirow" style="margin-top:.65rem;"><div class="points" id="dlg_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="dlg_reset">Reset</button></div>';

    var root=$("dlg_cards"); root.innerHTML="";

    cards.forEach(function(c,i){
      var row=document.createElement("div");
      row.className="qRow";
      row.innerHTML =
        '<div class="q">'+esc(c.title)+'</div>'+
        '<div style="color:var(--muted);margin:.25rem 0 .45rem">'+esc(c.prompt)+'</div>'+
        '<div class="opts"></div>'+
        '<div class="fb" id="dlg_fb_'+i+'" aria-live="polite"></div>'+
        '<div class="minirow" style="margin-top:.45rem">'+
          '<button class="btn btn--ghost" type="button" id="dlg_hint_'+i+'">Hint</button>'+
          '<button class="btn btn--ghost listenBtn" type="button" data-say="'+esc(c.best)+'">▶ Listen correct</button></div>';
      var opts=row.querySelector(".opts");
      c.choices = shuffleNotSame(c.choices);
      c.choices.forEach(function(opt){
        var b=document.createElement("button");
        b.type="button";
        b.className="optBtn";
        b.textContent=opt;
        b.addEventListener("click", function(){
          var fb=$("dlg_fb_"+i);
          if(opt===c.best){
            b.classList.add("good");
            var got=award(prefix+c.id+"__pts2");
            fb.className="fb good";
            fb.textContent= got ? "✅ Great! +2 pts." : "✅ Correct — already counted.";
          }else{
            b.classList.add("bad");
            fb.className="fb bad";
            fb.textContent="❌ Not quite. Hint: "+c.hint;
          }
          renderPts(); renderScore();
        });
        opts.appendChild(b);
      });
      row.querySelector("#dlg_hint_"+i).addEventListener("click", function(){
        var fb=$("dlg_fb_"+i); fb.className="fb"; fb.textContent=c.hint;
      });
      root.appendChild(row);
    });

    function renderPts(){
      var total=0;
      cards.forEach(function(c){ if(state.earned[prefix+c.id+"__pts2"]) total+=2; });
      $("dlg_pts").textContent = total ? (total+" pts") : "0 pts";
    }
    function reset(){ unawardPrefix(prefix); renderDialogues(); renderScore(); }
    $("dlg_reset").addEventListener("click", reset);
    renderPts();
  }

  function renderReading(){
    var box=$("reading"); if(!box) return;
    var prefix="read__";
    var pts=8; state.possible+=pts;

    var text = "Meatloaf became famous in the United States as a practical, budget-friendly comfort food — especially during hard times when families stretched meat with bread or crackers. Corned beef hash is also practical: chopped leftovers fried with potatoes and onions. In many diners, hash is popular for breakfast and is often served with eggs. In New England, corned beef dinners can lead to a next-day breakfast hash.";

    var mcq=[
      { q:"Why did meatloaf become popular?", a:"Because it stretches meat and is budget-friendly", opts:["Because it is a dessert","Because it stretches meat and is budget-friendly","Because it is only eaten at weddings"], hint:"Think: budget, stretching ingredients." },
      { q:"When is corned beef hash often eaten in the US?", a:"For breakfast", opts:["For breakfast","Only at midnight","Only on birthdays"], hint:"Diners often serve it with eggs." }
    ];
    var tf=[ { s:"Hash can be made from leftovers.", t:true }, { s:"Meatloaf is always served raw.", t:false } ];

    box.innerHTML =
      '<h3>Reading: comfort food & history</h3>'+
      '<p class="subline">Read, then answer. (Instant feedback.)</p>'+
      '<div class="callout callout--soft" style="line-height:1.35">'+esc(text)+'</div>'+
      '<div class="minirow" style="margin-top:.6rem"><button class="btn btn--ghost listenBtn" type="button" data-say="'+esc(text)+'">▶ Listen</button></div>'+
      '<div id="read_mcq"></div>'+
      '<div class="panel" style="margin-top:.8rem"><h4>True / False</h4><div id="read_tf"></div></div>'+
      '<div class="minirow" style="margin-top:.65rem"><div class="points" id="read_pts">0 pts</div>'+
        '<button class="btn btn--ghost" type="button" id="read_reset">Reset</button></div>';

    var mcqRoot=$("read_mcq"); mcqRoot.innerHTML="";
    mcq.forEach(function(q,i){
      var row=document.createElement("div");
      row.className="qRow";
      row.innerHTML =
        '<div class="q">'+esc("MCQ "+(i+1)+": "+q.q)+'</div>'+
        '<div class="opts"></div>'+
        '<div class="fb" id="read_fb_'+i+'" aria-live="polite"></div>'+
        '<div class="minirow" style="margin-top:.45rem"><button class="btn btn--ghost" type="button" id="read_hint_'+i+'">Hint</button></div>';
      var opts=row.querySelector(".opts");
      q.opts = shuffleNotSame(q.opts);
      q.opts.forEach(function(opt){
        var b=document.createElement("button");
        b.type="button";
        b.className="optBtn";
        b.textContent=opt;
        b.addEventListener("click", function(){
          var fb=$("read_fb_"+i);
          if(opt===q.a){
            b.classList.add("good");
            var got=award(prefix+"mcq"+i+"__pts2");
            fb.className="fb good";
            fb.textContent= got ? "✅ Correct! +2 pts." : "✅ Correct — already counted.";
          }else{
            b.classList.add("bad");
            fb.className="fb bad";
            fb.textContent="❌ Not quite. Hint: "+q.hint;
          }
          renderPts(); renderScore();
        });
        opts.appendChild(b);
      });
      row.querySelector("#read_hint_"+i).addEventListener("click", function(){
        var fb=$("read_fb_"+i); fb.className="fb"; fb.textContent=q.hint;
      });
      mcqRoot.appendChild(row);
    });

    var tfRoot=$("read_tf"); tfRoot.innerHTML="";
    tf.forEach(function(x,i){
      var row=document.createElement("div");
      row.className="qRow";
      row.innerHTML =
        '<div class="q">'+esc(x.s)+'</div>'+
        '<div class="opts">'+
          '<button class="optBtn" type="button" data-tf="'+i+'" data-a="true">True</button>'+
          '<button class="optBtn" type="button" data-tf="'+i+'" data-a="false">False</button>'+
        '</div>'+
        '<div class="fb" id="tf_fb_'+i+'" aria-live="polite"></div>';
      tfRoot.appendChild(row);
    });
    tfRoot.addEventListener("click", function(e){
      var b=e.target && e.target.closest ? e.target.closest("button[data-tf]") : null;
      if(!b) return;
      var i=parseInt(b.getAttribute("data-tf"),10);
      var a=(b.getAttribute("data-a")==="true");
      var fb=$("tf_fb_"+i);
      if(a===tf[i].t){
        b.classList.add("good");
        var got=award(prefix+"tf"+i+"__pts2");
        fb.className="fb good";
        fb.textContent= got ? "✅ Correct! +2 pts." : "✅ Correct — already counted.";
      }else{
        b.classList.add("bad");
        fb.className="fb bad";
        fb.textContent="❌ Not quite.";
      }
      renderPts(); renderScore();
    });

    function renderPts(){
      var total=0;
      for(var i=0;i<mcq.length;i++) if(state.earned[prefix+"mcq"+i+"__pts2"]) total+=2;
      for(var j=0;j<tf.length;j++) if(state.earned[prefix+"tf"+j+"__pts2"]) total+=2;
      $("read_pts").textContent = total ? (total+" pts") : "0 pts";
    }
    function reset(){ unawardPrefix(prefix); renderReading(); renderScore(); }
    $("read_reset").addEventListener("click", reset);
    renderPts();
  }

  function rebuildDynamic(){
    state.possible = 0;
    renderRecipeCards();
    renderRecipeDetails();
    renderVocab();
    renderShoppingList();
    renderStoreMatch();
    renderAisleSort();
    renderSentenceOrder();
    renderDiscountSign();
    renderCheckoutMCQ();
    renderPrepositions();
    renderVerbTenses();
    renderAdjAdv();
    renderComparatives();
    renderDialogues();
    renderReading();
    renderScore();
  }

  function bindGlobalControls(){
    var resetAll=$("btnResetAll");
    if(resetAll) resetAll.addEventListener("click", function(){
      state.earned={};
      state.customList=[];
      state.selected={};
      saveState();
      rebuildDynamic();
      speak("All progress has been reset.");
    });
  }

  var didBind=false;
  function init(){
    loadState();
    if(!RECIPES.some(function(r){return r.id===state.recipeId;})) state.recipeId=RECIPES[0].id;
    ensureSelectionDefaults();
    saveState();

    if(!didBind){
      bindSpeechButtons();
      bindGlobalControls();
      bindRecipeHandlers();
      bindIngredientPicker();
      bindSelectClearButtons();
      bindShoppingListHandlers();
      bindListControls();
      bindVocabHandlers();
      bindVocabControls();
      didBind=true;
    }
    rebuildDynamic();
  }

  if("speechSynthesis" in window){
    collectVoices();
    window.speechSynthesis.onvoiceschanged = function(){ collectVoices(); };
  }
  document.addEventListener("DOMContentLoaded", init);
})();