/* SpeakEasyTisha — Cooking Quest
   Fully interactive: vocab flashcards + grammar mini-games + store activities + dialogues + reading
   Touch-friendly: drag AND tap mode (tap tile -> tap target).
   Speech: browser speechSynthesis with US/UK accent preference.

   Works on Mac + iPad Safari.
*/
(function () {
  "use strict";

  /* ---------------------------
     Helpers
  ----------------------------*/
  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }


  // Normalize text for comparisons (case/spacing/punctuation tolerant)
  function normalize(s) {
    return String(s == null ? "" : s)
      .toLowerCase()
      .replace(/\u00a0/g, " ")
      .replace(/[’]/g, "'")
      .replace(/\s+/g, " ")
      .replace(/\s+([,?.!])/g, "$1")
      .replace(/[“”"]/g, "")
      .replace(/[^a-z0-9' ,?.!\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function shuffle(a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // Shuffle a bank, but try to avoid showing it in the same order as the answers
  function scrambleBank(bank, avoidSeq) {
    var base = (bank || []).slice();
    var avoid = (avoidSeq || []).map(function (x) { return normalize(String(x || "")); });

    function samePrefix(arr) {
      var n = Math.min(arr.length, avoid.length);
      for (var i = 0; i < n; i++) {
        if (normalize(String(arr[i] || "")) !== avoid[i]) return false;
      }
      return true;
    }

    for (var tries = 0; tries < 35; tries++) {
      var s = shuffle(base);
      if (!samePrefix(s)) return s;
    }
    return base.reverse();
  }


  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  /* ---------------------------
     Storage + Score
  ----------------------------*/
  var LS = {
    accent: "seTishaCookingQuestAccent",
    score: "seTishaCookingQuestScore",
    earned: "seTishaCookingQuestEarned",
    recipe: "seTishaCookingQuestRecipe",
    list: "seTishaCookingQuestList"
  };

  var state = {
    accent: "us",         // us | uk
    voice: null,
    score: 0,
    possible: 0,
    earned: {},           // key -> true
    recipeId: "stirfry",
    customList: []
  };

  function loadState() {
    try {
      var a = localStorage.getItem(LS.accent);
      if (a === "us" || a === "uk") state.accent = a;

      var sc = parseInt(localStorage.getItem(LS.score), 10);
      if (!isNaN(sc)) state.score = sc;

      var earnedRaw = localStorage.getItem(LS.earned);
      if (earnedRaw) state.earned = JSON.parse(earnedRaw) || {};

      var r = localStorage.getItem(LS.recipe);
      if (r) state.recipeId = r;

      var listRaw = localStorage.getItem(LS.list);
      if (listRaw) state.customList = JSON.parse(listRaw) || [];
    } catch (e) { /* ignore */ }
  }

  function saveState() {
    try {
      localStorage.setItem(LS.accent, state.accent);
      localStorage.setItem(LS.score, String(state.score));
      localStorage.setItem(LS.earned, JSON.stringify(state.earned || {}));
      localStorage.setItem(LS.recipe, state.recipeId);
      localStorage.setItem(LS.list, JSON.stringify(state.customList || []));
    } catch (e) { /* ignore */ }
  }

  function setPossible(total) {
    state.possible = total;
    renderScore();
  }

  function award(key, pts) {
    if (state.earned[key]) return false;
    state.earned[key] = true;
    state.score += pts;
    saveState();
    renderScore();
    return true;
  }

  function unawardPrefix(prefix) {
    Object.keys(state.earned).forEach(function (k) {
      if (k.indexOf(prefix) === 0) delete state.earned[k];
    });
    saveState();
  }

  function renderScore() {
    var top = $("scoreTop");
    var bottom = $("scoreBottom");
    if (top) top.textContent = state.score + " / " + state.possible;
    if (bottom) bottom.textContent = state.score + " / " + state.possible;

    var lvl = $("levelPill");
    if (lvl) {
      var pct = state.possible ? (state.score / state.possible) : 0;
      var label = "Starter";
      if (pct >= 0.85) label = "Advanced";
      else if (pct >= 0.65) label = "Confident";
      else if (pct >= 0.40) label = "Developing";
      lvl.textContent = "Level: " + label;
    }
  }

  function resetAll() {
    state.score = 0;
    state.earned = {};
    state.customList = [];
    state.recipeId = "stirfry";
    saveState();
    // re-render everything
    initRecipeUI();
    renderShoppingList();
    renderVocab();
    renderAllActivities();
    renderDialogues();
    renderReading();
    renderScore();
    flash($("scoreTop"), "Score reset.");
  }

  function flash(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add("pill--good");
    setTimeout(function () {
      el.classList.remove("pill--good");
      renderScore();
    }, 900);
  }

  /* ---------------------------
     Speech (US/UK)
  ----------------------------*/
  var speechReady = false;

  function getPreferredLang() {
    return state.accent === "uk" ? "en-GB" : "en-US";
  }

  function pickVoice() {
    if (!("speechSynthesis" in window)) return null;
    var voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
    if (!voices || !voices.length) return null;

    var lang = getPreferredLang();
    var exact = null;
    var starts = null;
    var anyEn = null;

    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      if (!anyEn && v.lang && v.lang.indexOf("en") === 0) anyEn = v;
      if (v.lang === lang) exact = v;
      if (!starts && v.lang && v.lang.indexOf(lang.split("-")[0]) === 0) starts = v;
    }
    return exact || starts || anyEn || voices[0];
  }

  function ensureVoice() {
    if (!("speechSynthesis" in window)) return;
    state.voice = pickVoice();
    var meta = $("voiceMeta");
    if (meta) {
      if (!state.voice) meta.textContent = "Voice will load… (tap Listen again if needed).";
      else meta.textContent = "Using: " + state.voice.name + " (" + state.voice.lang + "). Tap any Listen button.";
    }
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    if (!text) return;

    // iOS Safari sometimes needs a tiny delay + voice list loaded
    ensureVoice();
    var u = new SpeechSynthesisUtterance(String(text));
    if (state.voice) u.voice = state.voice;
    u.lang = getPreferredLang();
    u.rate = 1;
    u.pitch = 1;
    try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    try { speechSynthesis.speak(u); } catch (e2) { /* ignore */ }
  }

  function pauseSpeech() {
    if (!("speechSynthesis" in window)) return;
    try { speechSynthesis.pause(); } catch (e) { /* ignore */ }
  }

  function stopSpeech() {
    if (!("speechSynthesis" in window)) return;
    try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }

  function bindSpeechButtons() {
    var pauseBtn = $("btnPause");
    var stopBtn = $("btnStop");
    if (pauseBtn) pauseBtn.addEventListener("click", pauseSpeech);
    if (stopBtn) stopBtn.addEventListener("click", stopSpeech);

    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t) return;
      // allow click on child inside a listen button
      var btn = t.closest ? t.closest(".listenBtn") : null;
      if (!btn) return;
      var say = btn.getAttribute("data-say");
      if (!say) {
        // Some are set dynamically
        say = btn.dataset ? btn.dataset.say : "";
      }
      if (say) speak(say);
    });
  }

  function setAccent(accent) {
    state.accent = accent;
    saveState();
    var us = $("voiceUS");
    var uk = $("voiceUK");
    if (us && uk) {
      us.setAttribute("aria-pressed", accent === "us" ? "true" : "false");
      uk.setAttribute("aria-pressed", accent === "uk" ? "true" : "false");
    }
    ensureVoice();
  }

  /* ---------------------------
     Data: Recipes + vocab
  ----------------------------*/
  var RECIPES = [
    {
      id: "stirfry",
      icon: "🥢",
      title: "Veggie Stir‑Fry",
      meta: "Fast • healthy • easy to customize",
      tags: ["15–20 min", "pan/wok", "lots of veggies"],
      storeTip: "Best store route: Supermarket for basics + Asian market for soy sauce or rice noodles (optional).",
      ingredients: [
        { key:"broccoli", name:"broccoli", emoji:"🥦", note:"produce section" },
        { key:"carrots", name:"carrots", emoji:"🥕", note:"produce section" },
        { key:"bellpepper", name:"bell pepper", emoji:"🫑", note:"produce section" },
        { key:"onion", name:"onion", emoji:"🧅", note:"produce section" },
        { key:"garlic", name:"garlic", emoji:"🧄", note:"produce section" },
        { key:"rice", name:"rice", emoji:"🍚", note:"grains aisle" },
        { key:"soy", name:"soy sauce", emoji:"🧴", note:"international aisle" },
        { key:"oil", name:"cooking oil", emoji:"🫒", note:"oil & vinegar aisle" }
      ]
    },
    {
      id: "tacos",
      icon: "🌮",
      title: "Taco Night",
      meta: "Fun • family‑friendly • great for speaking practice",
      tags: ["20–25 min", "assembly", "spices"],
      storeTip: "Best store route: Supermarket for tortillas + produce; butcher for fresh meat (optional); Mexican aisle for salsa.",
      ingredients: [
        { key:"tortillas", name:"tortillas", emoji:"🫓", note:"bread aisle / international" },
        { key:"tomatoes", name:"tomatoes", emoji:"🍅", note:"produce section" },
        { key:"lettuce", name:"lettuce", emoji:"🥬", note:"produce section" },
        { key:"cheese", name:"cheddar cheese", emoji:"🧀", note:"dairy section" },
        { key:"beans", name:"beans", emoji:"🫘", note:"canned goods aisle" },
        { key:"salsa", name:"salsa", emoji:"🥫", note:"international aisle" },
        { key:"spices", name:"taco seasoning", emoji:"🧂", note:"spice aisle" },
        { key:"lime", name:"lime", emoji:"🍋", note:"produce section" }
      ]
    },
    {
      id: "pasta",
      icon: "🍝",
      title: "Tomato Pasta",
      meta: "Classic • budget‑friendly • supermarket basics",
      tags: ["25–30 min", "pot", "simple sauce"],
      storeTip: "Best store route: One supermarket is enough (pasta aisle + canned tomatoes + dairy for parmesan).",
      ingredients: [
        { key:"pasta", name:"pasta", emoji:"🍝", note:"pasta aisle" },
        { key:"tomatoCan", name:"canned tomatoes", emoji:"🥫", note:"canned goods aisle" },
        { key:"basil", name:"fresh basil", emoji:"🌿", note:"herbs (produce)" },
        { key:"parmesan", name:"parmesan", emoji:"🧀", note:"dairy / cheese" },
        { key:"oliveoil", name:"olive oil", emoji:"🫒", note:"oil & vinegar aisle" },
        { key:"salt", name:"salt", emoji:"🧂", note:"spices" },
        { key:"pepper", name:"black pepper", emoji:"🧂", note:"spices" },
        { key:"garlic2", name:"garlic", emoji:"🧄", note:"produce section" }
      ]
    }
  ];

  var VOCAB = [
    // Ingredients
    { id:"v_broccoli", theme:"ingredients", icon:"🥦", front:"broccoli", back:"le brocoli", ex:"Add broccoli to the pan." },
    { id:"v_dairy", theme:"aisles", icon:"🥛", front:"dairy section", back:"le rayon produits laitiers", ex:"Milk is in the dairy section." },
    { id:"v_frozen", theme:"aisles", icon:"🧊", front:"frozen section", back:"le rayon surgelés", ex:"Frozen peas are in the frozen section." },
    { id:"v_produce", theme:"aisles", icon:"🥬", front:"produce section", back:"le rayon fruits et légumes", ex:"Fresh herbs are in the produce section." },
    { id:"v_bakery", theme:"aisles", icon:"🥖", front:"bakery", back:"la boulangerie (rayon)", ex:"Bread is in the bakery." },
    { id:"v_meat", theme:"aisles", icon:"🥩", front:"meat counter", back:"le rayon boucherie", ex:"Ask at the meat counter." },
    { id:"v_seafood", theme:"aisles", icon:"🐟", front:"seafood counter", back:"le rayon poissonnerie", ex:"Salmon is at the seafood counter." },
    { id:"v_spices", theme:"aisles", icon:"🧂", front:"spice aisle", back:"le rayon épices", ex:"Cumin is in the spice aisle." },
    { id:"v_canned", theme:"aisles", icon:"🥫", front:"canned goods aisle", back:"le rayon conserves", ex:"Tomatoes are in canned goods." },
    { id:"v_checkout", theme:"checkout", icon:"🧾", front:"receipt", back:"le ticket de caisse", ex:"Could I have the receipt, please?" },
    { id:"v_coupon", theme:"checkout", icon:"🏷️", front:"coupon", back:"un bon de réduction", ex:"Do you take coupons?" },
    { id:"v_discount", theme:"checkout", icon:"💸", front:"discount", back:"une remise", ex:"Is there a discount today?" },
    { id:"v_loyalty", theme:"checkout", icon:"💳", front:"loyalty card", back:"carte de fidélité", ex:"Do you have a loyalty card?" },
    { id:"v_bagger", theme:"checkout", icon:"🛍️", front:"bagger", back:"personne qui met les courses en sacs", ex:"The bagger can double-bag fragile items." },
    { id:"v_cart", theme:"checkout", icon:"🛒", front:"shopping cart", back:"caddie / chariot", ex:"Could I get a cart, please?" },
    { id:"v_basket", theme:"checkout", icon:"🧺", front:"basket", back:"panier", ex:"I’ll just take a basket." },
    { id:"v_aisle", theme:"aisles", icon:"🧭", front:"aisle", back:"une allée / un rayon", ex:"It’s in aisle 6." },
    { id:"v_display", theme:"aisles", icon:"📦", front:"on display", back:"en tête de gondole / en promotion", ex:"It’s on display near the entrance." },
    // Tools & verbs
    { id:"v_chop", theme:"tools", icon:"🔪", front:"to chop", back:"hacher", ex:"Chop the onions." },
    { id:"v_stir", theme:"tools", icon:"🥄", front:"to stir", back:"remuer", ex:"Stir the sauce slowly." },
    { id:"v_simmer", theme:"tools", icon:"🍲", front:"to simmer", back:"mijoter", ex:"Let it simmer for 10 minutes." },
    { id:"v_measure", theme:"tools", icon:"🥣", front:"to measure", back:"mesurer", ex:"Measure two cups of rice." },
    // UK/US differences (for groceries)
    { id:"u_cart", theme:"ukus", icon:"🛒", uk:"trolley", us:"cart", ex:"In the UK, a cart is often called a trolley." },
    { id:"u_zucchini", theme:"ukus", icon:"🥒", uk:"courgette", us:"zucchini", ex:"Courgette (UK) = zucchini (US)." },
    { id:"u_coriander", theme:"ukus", icon:"🌿", uk:"coriander", us:"cilantro", ex:"In the US, coriander leaves are called cilantro." },
    { id:"u_aubergine", theme:"ukus", icon:"🍆", uk:"aubergine", us:"eggplant", ex:"Aubergine (UK) = eggplant (US)." },
    { id:"u_biscuit", theme:"ukus", icon:"🍪", uk:"biscuit", us:"cookie", ex:"Biscuit (UK) = cookie (US)." }
  ];

  /* ---------------------------
     Recipe UI + Shopping list
  ----------------------------*/
  function currentRecipe() {
    for (var i = 0; i < RECIPES.length; i++) {
      if (RECIPES[i].id === state.recipeId) return RECIPES[i];
    }
    return RECIPES[0];
  }

  function initRecipeUI() {
    var grid = $("recipeGrid");
    if (!grid) return;
    grid.innerHTML = "";

    RECIPES.forEach(function (r) {
      var isActive = r.id === state.recipeId;
      var div = document.createElement("div");
      div.className = "recipeCard";
      div.innerHTML =
        '<div class="recipeCard__head">' +
          '<div class="recipeIcon" aria-hidden="true">' + esc(r.icon) + '</div>' +
          '<div>' +
            '<div class="recipeTitle">' + esc(r.title) + '</div>' +
            '<div class="recipeMeta">' + esc(r.meta) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="recipeTags">' +
          r.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") +
        '</div>' +
        '<div class="recipeCard__btns">' +
          '<button class="btn ' + (isActive ? "" : "btn--ghost") + '" type="button" data-pick="' + esc(r.id) + '">' +
            (isActive ? "Selected ✓" : "Choose this recipe") +
          "</button>" +
          '<button class="btn btn--ghost listenBtn" type="button" data-say="' + esc('Recipe: ' + r.title + '. ' + r.meta + '.') + '">Listen</button>' +
        "</div>";

      grid.appendChild(div);
    });

    grid.addEventListener("click", function (e) {
      var t = e.target;
      if (!t) return;
      var btn = t.closest ? t.closest("button[data-pick]") : null;
      if (!btn) return;
      var id = btn.getAttribute("data-pick");
      state.recipeId = id;
      saveState();
      initRecipeUI();
      renderShoppingList();
      renderAllActivities(); // activities depend on recipe
      renderVocab(); // refresh ingredient flashcards for the new recipe
      setStoreHint();
      speak("Great. You chose " + currentRecipe().title + ". Let's build your list.");
    });

    setStoreHint();
  }

  function shoppingItems() {
    // recipe items + custom items
    var base = currentRecipe().ingredients.map(function (it) {
      return { key: it.key, name: it.name, emoji: it.emoji, note: it.note, custom:false };
    });

    var custom = (state.customList || []).map(function (c, idx) {
      var clean = String(c || "").trim();
      if (!clean) return null;
      return { key: "custom_" + idx, name: clean, emoji: "🧾", note: "custom item", custom:true };
    }).filter(Boolean);

    return base.concat(custom);
  }

  function setStoreHint() {
    var el = $("storeHint");
    if (!el) return;
    el.textContent = currentRecipe().storeTip;
  }

  function renderShoppingList() {
    var box = $("shoppingList");
    if (!box) return;
    var items = shoppingItems();
    box.innerHTML = "";

    items.forEach(function (it) {
      var row = document.createElement("div");
      row.className = "itemRow";
      row.innerHTML =
        '<div class="itemLeft">' +
          '<div class="itemEmoji" aria-hidden="true">' + esc(it.emoji) + '</div>' +
          '<div>' +
            '<div class="itemName">' + esc(it.name) + '</div>' +
            '<div class="itemMeta">' + esc(it.note) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="itemBtns">' +
          '<button class="iconBtn listenBtn" type="button" title="Listen" data-say="' + esc(it.name) + '">🔊</button>' +
          (it.custom ? '<button class="iconBtn" type="button" title="Remove" data-remove="' + esc(it.key) + '">✖</button>' : '') +
        "</div>";
      box.appendChild(row);
    });

    box.addEventListener("click", function (e) {
      var t = e.target;
      var btn = t && t.closest ? t.closest("button[data-remove]") : null;
      if (!btn) return;
      var key = btn.getAttribute("data-remove");
      // remove by index in custom list
      var idx = parseInt(String(key).replace("custom_", ""), 10);
      if (!isNaN(idx)) {
        state.customList.splice(idx, 1);
        saveState();
        renderShoppingList();
        renderAllActivities();
      }
    });
  }

  function bindListControls() {
    var addBtn = $("btnAddItem");
    var inp = $("customItem");
    if (addBtn && inp) {
      addBtn.addEventListener("click", function () {
        var v = String(inp.value || "").trim();
        if (!v) return;
        state.customList.push(v);
        inp.value = "";
        saveState();
        renderShoppingList();
        renderAllActivities();
        speak("Added " + v + " to your list.");
      });

      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") addBtn.click();
      });
    }

    var copyBtn = $("btnCopyList");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var lines = shoppingItems().map(function (it) { return "- " + it.name; }).join("\n");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lines).then(function () {
            speak("Copied.");
          });
        } else {
          // fallback
          window.prompt("Copy your list:", lines);
        }
      });
    }

    var printBtn = $("btnPrintList");
    if (printBtn) {
      printBtn.addEventListener("click", function () { window.print(); });
    }

    var resetListBtn = $("btnResetList");
    if (resetListBtn) {
      resetListBtn.addEventListener("click", function () {
        state.customList = [];
        saveState();
        renderShoppingList();
        speak("List reset.");
      });
    }

    var planBtn = $("btnPlanStore");
    if (planBtn) {
      planBtn.addEventListener("click", function () {
        var r = currentRecipe();
        var msg = r.storeTip + " Next: produce section, then dry goods, then dairy/frozen, and finally checkout.";
        speak(msg);
        award("plan_route", 2);
        var hint = $("storeHint");
        if (hint) hint.textContent = r.storeTip + " ✅ (+2 pts)";
      });
    }
  }

  /* ---------------------------
     Speaking mini-practice (Step 1)
  ----------------------------*/
  function bindSpeakMini() {
    var model = $("btnSpeakModel1");
    var said = $("btnSaid1");
    var fb = $("speakFb1");
    if (model) model.addEventListener("click", function () {
      var items = shoppingItems();
      var pick = items[Math.floor(Math.random() * items.length)];
      var line = "Excuse me, where can I find " + pick.name + "?";
      model.setAttribute("data-say", line);
      speak(line);
      var prompt = $("speakPrompt1");
      if (prompt) prompt.textContent = "“" + line + "”";
    });
    if (said) said.addEventListener("click", function () {
      var ok = award("spoke_step1", 2);
      if (fb) {
        fb.className = "fb " + (ok ? "good" : "");
        fb.textContent = ok ? "Nice! +2 pts. (Keep practicing.)" : "Already counted — try another prompt!";
      }
    });
  }

  /* ---------------------------
     Vocabulary flashcards
  ----------------------------*/
  var vocabMode = "en"; // en or ukus
  var vocabTheme = "all";

  // Build ingredient flashcards dynamically from the selected recipe
  function ingredientVocabForCurrentRecipe() {
    var r = currentRecipe();
    var items = (r && r.ingredients) ? r.ingredients : [];
    return items.map(function (it) {
      var where = it.note ? ("Where to find it: " + it.note) : "";
      return {
        id: "ing_" + state.recipeId + "_" + it.key,
        theme: "ingredients",
        icon: it.emoji || "🥘",
        front: it.name,
        back: where || "Ingredient",
        ex: "I need " + it.name + "."
      };
    });
  }

  function vocabForTheme() {
    var list = VOCAB.filter(function (v) { return v.theme !== "ingredients"; });

    // Add dynamic ingredients for the currently selected recipe
    list = list.concat(ingredientVocabForCurrentRecipe());

    if (vocabTheme !== "all") {
      list = list.filter(function (v) { return v.theme === vocabTheme; });
    }

    // Mode: en shows standard entries + transforms uk/us into a normal card too.
    if (vocabMode === "en") {
      return list.map(function (v) {
        if (v.theme === "ukus") {
          return {
            id: v.id,
            icon: v.icon,
            front: v.us + " (US) / " + v.uk + " (UK)",
            back: v.us + " ↔ " + v.uk,
            ex: v.ex
          };
        }
        return v;
      });
    }

    // Mode: ukus shows only the ukus theme as a pair card
    return VOCAB.filter(function (v) { return v.theme === "ukus"; }).map(function (v) {
      return {
        id: v.id,
        icon: v.icon,
        front: v.uk + " (UK)",
        back: v.us + " (US)",
        ex: v.ex
      };
    });
  }

  function renderVocab() {
    var grid = $("vocabGrid");
    if (!grid) return;
    grid.innerHTML = "";

    var showExamples = $("showExamples") ? $("showExamples").checked : true;
    var cards = vocabForTheme();

    cards.forEach(function (v) {
      var outer = document.createElement("div");
      outer.className = "vcard";
      outer.tabIndex = 0;
      outer.setAttribute("role", "button");
      outer.setAttribute("aria-label", "Flashcard: " + (v.front || v.uk || ""));
      outer.dataset.id = v.id;

      var frontText = v.front || (v.uk ? (v.uk + " (UK)") : "");
      var backText = v.back || v.us || "";
      var ex = v.ex || "";

      outer.innerHTML =
        '<div class="vcard__inner">' +
          '<div class="vside vside--front">' +
            '<div class="vhead">' +
              '<div class="vtitle">' + esc(frontText) + '</div>' +
              '<div class="vicon" aria-hidden="true">' + esc(v.icon || "🧠") + '</div>' +
            "</div>" +
            '<div class="vactions">' +
              '<button class="smallBtn listenBtn" type="button" data-say="' + esc(frontText) + '">Listen</button>' +
              '<button class="smallBtn" type="button" data-flip="1">Flip</button>' +
            "</div>" +
          "</div>" +
          '<div class="vside vside--back">' +
            '<div>' +
              '<div class="vmeta">' + esc(backText) + "</div>" +
              (showExamples && ex ? '<div class="vex">Example: <em>' + esc(ex) + "</em></div>" : "") +
            "</div>" +
            '<div class="vactions">' +
              '<button class="smallBtn listenBtn" type="button" data-say="' + esc(frontText) + '">Listen</button>' +
              '<button class="smallBtn" type="button" data-flip="1">Flip</button>' +
            "</div>" +
          "</div>" +
        "</div>";

      grid.appendChild(outer);
    });

    // Flip behavior

    // Bind flip handlers once (prevents double-toggle after changing dropdown)
    if (!grid.dataset.vocabBound) {
    grid.addEventListener("click", function (e) {
      var t = e.target;
      if (!t) return;
      var flipBtn = t.closest ? t.closest("button[data-flip]") : null;
      if (flipBtn) {
        var card = flipBtn.closest(".vcard");
        if (card) card.classList.toggle("is-flipped");
        return;
      }
      var vcard = t.closest ? t.closest(".vcard") : null;
      if (vcard && !(t.closest && t.closest("button"))) {
        vcard.classList.toggle("is-flipped");
      }
    });

    

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var card = e.target && e.target.classList && e.target.classList.contains("vcard") ? e.target : null;
      if (card) card.classList.toggle("is-flipped");
    });
  
      grid.dataset.vocabBound = "1";
    }
}

  function bindVocabControls() {
    var themeSel = $("vocabTheme");
    var modeEN = $("modeEN");
    var modeUKUS = $("modeUKUS");
    var examples = $("showExamples");
    var reset = $("resetVocab");

    if (themeSel) {
      themeSel.addEventListener("change", function () {
        vocabTheme = themeSel.value;
        renderVocab();
      });
    }

    if (modeEN && modeUKUS) {
      modeEN.addEventListener("click", function () {
        vocabMode = "en";
        modeEN.setAttribute("aria-pressed", "true");
        modeUKUS.setAttribute("aria-pressed", "false");
        renderVocab();
      });
      modeUKUS.addEventListener("click", function () {
        vocabMode = "ukus";
        modeEN.setAttribute("aria-pressed", "false");
        modeUKUS.setAttribute("aria-pressed", "true");
        renderVocab();
      });
    }

    if (examples) examples.addEventListener("change", renderVocab);

    if (reset) {
      reset.addEventListener("click", function () {
        vocabTheme = "all";
        vocabMode = "en";
        if (themeSel) themeSel.value = "all";
        if (modeEN && modeUKUS) {
          modeEN.setAttribute("aria-pressed", "true");
          modeUKUS.setAttribute("aria-pressed", "false");
        }
        if (examples) examples.checked = true;
        renderVocab();
      });
    }
  }

  /* ---------------------------
     Tap-mode Drag helpers
  ----------------------------*/
  var tapPicked = null; // element

  function setTapModePill(on) {
    var pill = $("tapModePill");
    if (!pill) return;
    pill.textContent = "Tap mode: " + (on ? "ON" : "OFF");
    pill.className = "pill " + (on ? "pill--good" : "pill--muted");
  }

  function isTouchPreferred() {
    // default ON; if user has mouse they can still drag.
    return true;
  }

  function clearPicked() {
    if (tapPicked) tapPicked.classList.remove("is-picked");
    tapPicked = null;
  }

  function enableTapPick(tileEl) {
    if (!tileEl) return;
    if (tapPicked === tileEl) {
      clearPicked();
      return;
    }
    clearPicked();
    tapPicked = tileEl;
    tileEl.classList.add("is-picked");
  }

  function tryTapDrop(targetSlot) {
    if (!tapPicked || !targetSlot) return false;
    if (targetSlot.dataset.locked === "1") return false;

    var val = tapPicked.dataset.value;
    targetSlot.textContent = val;
    targetSlot.dataset.value = val;
    clearPicked();
    return true;
  }

  function makeDraggable(tile) {
    tile.setAttribute("draggable", "true");
    tile.addEventListener("dragstart", function (e) {
      // Keep a reference to the dragged element (helps multi-drop zones + Safari)
      window.__dragEl = tile;
      try { if (e.dataTransfer) { e.dataTransfer.setData("text/plain", tile.dataset.value || ""); e.dataTransfer.effectAllowed = "move"; } } catch (err) {}
    });
    tile.addEventListener("dragend", function () {
      try { window.__dragEl = null; } catch (e) {}
    });
  }

  function makeDroppable(slot) {
    slot.addEventListener("dragover", function (e) {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    });
    slot.addEventListener("drop", function (e) {
      e.preventDefault();
      var data = "";
      try { data = e.dataTransfer ? e.dataTransfer.getData("text/plain") : ""; } catch (err) { data = ""; }
      if (!data) return;
      if (slot.dataset.locked === "1") return;
      slot.textContent = data;
      slot.dataset.value = data;
      clearPicked();
    });
  }

  /* ---------------------------
     Mini Games + Activities
  ----------------------------*/
  function renderMiniMCQ(containerId, cfg) {
    var box = $(containerId);
    if (!box) return;

    var prefix = cfg.keyPrefix;
    var ptsPer = cfg.ptsPer || 1;

    var total = cfg.questions.length * ptsPer;
    state.possible += total;

    box.innerHTML =
      '<h4>' + esc(cfg.title) + '</h4>' +
      '<p class="subline">' + esc(cfg.subtitle || "") + "</p>" +
      '<div class="mcq" id="' + esc(containerId) + '_mcq"></div>' +
      '<div class="card__row" style="margin-top:.6rem">' +
        '<div class="points" id="' + esc(containerId) + '_pts">0 pts</div>' +
        '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_reset">Reset quiz</button>' +
      "</div>";

    var mcq = $(containerId + "_mcq");
    var ptsEl = $(containerId + "_pts");
    var resetBtn = $(containerId + "_reset");

    function updatePts() {
      var earnedCount = 0;
      cfg.questions.forEach(function (q, idx) {
        if (state.earned[prefix + idx]) earnedCount += ptsPer;
      });
      if (ptsEl) ptsEl.textContent = earnedCount + " pts";
    }

    function resetQuiz() {
      unawardPrefix(prefix);
      // Clear UI
      renderMiniMCQ(containerId, cfg);
      renderScore();
    }

    cfg.questions.forEach(function (q, idx) {
      var qDiv = document.createElement("div");
      qDiv.className = "q";
      qDiv.innerHTML =
        '<div class="q__title">' + esc(q.prompt) + "</div>" +
        '<div class="choices"></div>' +
        '<div class="q__meta" id="' + esc(containerId) + "_m" + idx + '"></div>';
      mcq.appendChild(qDiv);

      var choices = qDiv.querySelector(".choices");
      shuffle(q.choices).forEach(function (c) {
        var b = document.createElement("button");
        b.className = "choiceBtn";
        b.type = "button";
        b.textContent = c;
        b.addEventListener("click", function () {
          // lock once correct, allow retries (no extra points)
          var meta = $(containerId + "_m" + idx);
          // clear styles
          var all = choices.querySelectorAll(".choiceBtn");
          for (var i = 0; i < all.length; i++) all[i].classList.remove("good", "bad");

          if (c === q.answer) {
            b.classList.add("good");
            if (meta) meta.textContent = "✅ Correct. " + (q.explain || "");
            award(prefix + idx, ptsPer);
            updatePts();
          } else {
            b.classList.add("bad");
            if (meta) meta.textContent = "❌ Not quite. Hint: " + (q.hint || "Try again.");
          }
        });
        choices.appendChild(b);
      });
    });

    if (resetBtn) resetBtn.addEventListener("click", resetQuiz);
    updatePts();
  }

  function renderMiniFill(containerId, cfg) {
    var box = $(containerId);
    if (!box) return;

    var prefix = cfg.keyPrefix;
    var pts = cfg.pts || 4;
    state.possible += pts;

    box.innerHTML =
      '<h4>' + esc(cfg.title) + '</h4>' +
      '<p class="subline">' + esc(cfg.subtitle || "") + "</p>" +
      '<div class="wordBank" id="' + esc(containerId) + '_bank"></div>' +
      '<div class="blanks" id="' + esc(containerId) + '_rows"></div>' +
      '<div class="card__row" style="margin-top:.65rem">' +
        '<div class="points" id="' + esc(containerId) + '_pts">0 pts</div>' +
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap">' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_check">Check</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_hint">Hint</button>' +
          '<button class="btn btn--ghost listenBtn" type="button" id="' + esc(containerId) + '_listen">Listen</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_reset">Reset</button>' +
        "</div>" +
      "</div>" +
      '<div class="fb" id="' + esc(containerId) + '_fb" aria-live="polite"></div>';

    var bank = $(containerId + "_bank");
    var rows = $(containerId + "_rows");
    var fb = $(containerId + "_fb");
    var checkBtn = $(containerId + "_check");
    var hintBtn = $(containerId + "_hint");
    var resetBtn = $(containerId + "_reset");
    var listenBtn = $(containerId + "_listen");
    var focused = null;

    function markBankUsed() {
      var words = bank.querySelectorAll(".bankWord");
      for (var i = 0; i < words.length; i++) {
        var w = words[i];
        var val = w.dataset.word;
        var used = false;
        var ins = rows.querySelectorAll("input");
        for (var j = 0; j < ins.length; j++) {
          if (String(ins[j].value || "").trim().toLowerCase() === val.toLowerCase()) used = true;
        }
        w.classList.toggle("used", used);
      }
    }

    scrambleBank(cfg.bank, (cfg.items || []).map(function(it){ return it.answer; })).forEach(function (w) {
      var bw = document.createElement("button");
      bw.className = "bankWord";
      bw.type = "button";
      bw.dataset.word = w;
      bw.textContent = w;
      bw.addEventListener("click", function () {
        if (!focused) return;
        focused.value = w;
        focused.dispatchEvent(new Event("input", { bubbles:true }));
        markBankUsed();
      });
      bank.appendChild(bw);
    });

    cfg.items.forEach(function (it, idx) {
      var r = document.createElement("div");
      r.className = "blankRow";
      r.innerHTML =
        '<span class="badge">' + esc(it.label) + "</span>" +
        '<span>' + esc(it.before) + "</span>" +
        '<input inputmode="text" autocomplete="off" aria-label="Blank ' + (idx+1) + '" />' +
        '<span>' + esc(it.after) + "</span>" +
        '<span class="badge" id="' + esc(containerId) + "_b" + idx + '">…</span>';
      rows.appendChild(r);

      var inp = r.querySelector("input");
      inp.addEventListener("focus", function () { focused = inp; });
      inp.addEventListener("input", markBankUsed);
    });

    function check() {
      var ok = 0;
      cfg.items.forEach(function (it, idx) {
        var row = rows.children[idx];
        var inp = row.querySelector("input");
        var val = String(inp.value || "").trim().toLowerCase();
        var badge = $(containerId + "_b" + idx);
        var good = val === String(it.answer).trim().toLowerCase();
        if (good) ok++;
        badge.textContent = good ? "✓" : "✗";
        badge.className = "badge " + (good ? "good" : "bad");
      });

      var all = ok === cfg.items.length;
      if (all) {
        var got = award(prefix + "all", pts);
        if (fb) {
          fb.className = "fb good";
          fb.textContent = got ? ("✅ Perfect! +" + pts + " pts.") : "✅ Correct — already counted.";
        }
        var ptsEl = $(containerId + "_pts");
        if (ptsEl) ptsEl.textContent = pts + " pts";
      } else {
        if (fb) {
          fb.className = "fb bad";
          fb.textContent = "Not yet: " + ok + " / " + cfg.items.length + " correct. Fix the ✗ blanks.";
        }
      }
      markBankUsed();
      renderScore();
    }

    function hint() {
      if (!fb) return;
      fb.className = "fb";
      fb.textContent = cfg.hint || "Tip: focus a blank, then tap a word in the bank.";
    }

    function reset() {
      unawardPrefix(prefix);
      renderMiniFill(containerId, cfg);
      renderScore();
    }

    if (checkBtn) checkBtn.addEventListener("click", check);
    if (hintBtn) hintBtn.addEventListener("click", hint);
    if (resetBtn) resetBtn.addEventListener("click", reset);

    if (listenBtn) {
      listenBtn.setAttribute("data-say", cfg.listenText || "Fill in the blanks using the word bank.");
    }

    // Points indicator
    var ptsEl2 = $(containerId + "_pts");
    if (ptsEl2) ptsEl2.textContent = state.earned[prefix + "all"] ? (pts + " pts") : "0 pts";
  }

  function renderMiniOrder(containerId, cfg) {
    var box = $(containerId);
    if (!box) return;

    var prefix = cfg.keyPrefix;
    var pts = cfg.pts || 3;
    state.possible += pts;

    var order = shuffle((cfg.chunks || []).slice());

    box.innerHTML =
      '<h4>' + esc(cfg.title) + "</h4>" +
      '<p class="subline">' + esc(cfg.subtitle || "") + "</p>" +
      '<div class="tileTray" id="' + esc(containerId) + '_tiles"></div>' +
      '<div class="dropZone" style="margin-top:.7rem">' +
        '<div class="dzLabel">Answer</div>' +
        '<div class="dzSlot" id="' + esc(containerId) + '_slot" aria-label="Answer area (drop multiple tiles)"></div>' +
        '<button class="iconBtn" type="button" id="' + esc(containerId) + '_clear" title="Clear">↩</button>' +
      "</div>" +
      '<div class="card__row" style="margin-top:.65rem">' +
        '<div class="points" id="' + esc(containerId) + '_pts">0 pts</div>' +
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap">' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_check">Check</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_hint">Hint</button>' +
          '<button class="btn btn--ghost listenBtn" type="button" id="' + esc(containerId) + '_listen">Listen</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_reset">Reset</button>' +
        "</div>" +
      "</div>" +
      '<div class="fb" id="' + esc(containerId) + '_fb" aria-live="polite"></div>';

    var tray = $(containerId + "_tiles");
    var slot = $(containerId + "_slot");
    var fb = $(containerId + "_fb");
    var checkBtn = $(containerId + "_check");
    var hintBtn = $(containerId + "_hint");
    var resetBtn = $(containerId + "_reset");
    var listenBtn = $(containerId + "_listen");
    var clearBtn = $(containerId + "_clear");
    var ptsEl = $(containerId + "_pts");

    // Build tiles
    order.forEach(function (c) {
      var tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = c;
      tile.dataset.value = c;
      makeDraggable(tile);

      // Tap mode:
      // - tap a tile in the tray to pick it
      // - tap the answer area to add it
      // - tap a tile in the answer area to remove it
      tile.addEventListener("click", function () {
        if (tile.parentNode === slot) {
          tray.appendChild(tile);
          tile.classList.remove("good", "bad");
          clearPicked();
          return;
        }
        enableTapPick(tile);
      });

      tray.appendChild(tile);
    });

    // Make tray + slot droppable for multiple tiles
    function handleDrop(targetEl, e) {
      e.preventDefault();
      var dragged = window.__dragEl || null;
      if (!dragged) return;

      // Only handle our tiles
      if (!dragged.classList || !dragged.classList.contains("tile")) return;

      // Insert before a tile if dropping on one (supports reordering in the answer area)
      var before = null;
      var t = e.target;
      if (t && t.closest) {
        var hit = t.closest(".tile");
        if (hit && hit.parentNode === targetEl && hit !== dragged) before = hit;
      }

      if (before) targetEl.insertBefore(dragged, before);
      else targetEl.appendChild(dragged);
    }

    [tray, slot].forEach(function (el) {
      el.addEventListener("dragover", function (e) { e.preventDefault(); });
      el.addEventListener("drop", function (e) { handleDrop(el, e); });
    });

    // Tap: place picked tile into the answer area
    slot.addEventListener("click", function () {
      if (!tapPicked) return;
      if (tapPicked.parentNode !== tray) return;
      slot.appendChild(tapPicked);
      clearPicked();
    });

    function clearAll() {
      var tiles = slot.querySelectorAll(".tile");
      for (var i = 0; i < tiles.length; i++) {
        tray.appendChild(tiles[i]);
        tiles[i].classList.remove("good", "bad");
      }
      slot.classList.remove("good", "bad");
      fb.className = "fb";
      fb.textContent = "";
      clearPicked();
    }

    if (clearBtn) clearBtn.addEventListener("click", clearAll);

    function buildAnswer() {
      var parts = [];
      var tiles = slot.querySelectorAll(".tile");
      for (var i = 0; i < tiles.length; i++) parts.push(String(tiles[i].dataset.value || "").trim());
      var ans = parts.join(" ").replace(/\s+([,?.!])/g, "$1").replace(/\s+/g, " ").trim();
      return ans;
    }

    function hint() {
      fb.className = "fb";
      fb.textContent = cfg.hint || "Tip: start with a verb (Go / Turn / Take), then add the details.";
    }

    function check() {
      var ans = buildAnswer();
      var target = String(cfg.answer || "").trim();
      var good = normalize(ans) === normalize(target);

      slot.classList.remove("good", "bad");
      slot.classList.add(good ? "good" : "bad");

      if (good) {
        award(prefix + "ok", pts);
        fb.className = "fb good";
        fb.textContent = "✅ Correct! Great sentence.";
      } else {
        fb.className = "fb bad";
        fb.textContent = "❌ Not yet. Try moving the tiles into the right order.";
      }

      renderScore();
      if (ptsEl) ptsEl.textContent = state.earned[prefix + "ok"] ? (pts + " pts") : "0 pts";
    }

    function reset() {
      unawardPrefix(prefix);
      renderMiniOrder(containerId, cfg);
      renderScore();
    }

    if (checkBtn) checkBtn.addEventListener("click", check);
    if (hintBtn) hintBtn.addEventListener("click", hint);
    if (resetBtn) resetBtn.addEventListener("click", reset);
    if (listenBtn) listenBtn.setAttribute("data-say", cfg.listenText || cfg.answer || "");
    if (ptsEl) ptsEl.textContent = state.earned[prefix + "ok"] ? (pts + " pts") : "0 pts";
  }

  function renderMatchDnD(containerId, cfg) {
    var box = $(containerId);
    if (!box) return;

    var prefix = cfg.keyPrefix;
    var pts = cfg.pts || 5;
    state.possible += pts;

    // Unique categories (right side)
    var cats = [];
    var seen = {};
    cfg.items.forEach(function (it) {
      var c = String(it.right || "").trim();
      if (!seen[c]) { seen[c] = true; cats.push(c); }
    });

    box.innerHTML =
      '<h3>' + esc(cfg.title) + "</h3>" +
      '<p class="subline">' + esc(cfg.subtitle || "Tap a tile, then tap a category box.") + "</p>" +
      '<div class="tileTray" id="' + esc(containerId) + '_tiles"></div>' +
      '<div class="dropGrid" style="margin-top:.8rem" id="' + esc(containerId) + '_grid"></div>' +
      '<div class="card__row" style="margin-top:.65rem">' +
        '<div class="points" id="' + esc(containerId) + '_pts">0 pts</div>' +
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap">' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_check">Check</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_hint">Hint</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_reset">Reset</button>' +
        "</div>" +
      "</div>" +
      '<div class="fb" id="' + esc(containerId) + '_fb" aria-live="polite"></div>';

    var tray = $(containerId + "_tiles");
    var grid = $(containerId + "_grid");
    var fb = $(containerId + "_fb");
    var checkBtn = $(containerId + "_check");
    var hintBtn = $(containerId + "_hint");
    var resetBtn = $(containerId + "_reset");
    var ptsEl = $(containerId + "_pts");

    // Build tiles (each tile knows its correct category)
    var tilesData = shuffle(cfg.items.slice());
    tilesData.forEach(function (it, idx) {
      var tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.value = String(it.left || "").trim();
      tile.dataset.correct = String(it.right || "").trim();
      tile.innerHTML = '<span aria-hidden="true">🧩</span>' + esc(tile.dataset.value);
      makeDraggable(tile);

      tile.addEventListener("click", function () {
        // If already placed in a category, tap to return it to the tray
        if (tile.parentNode && tile.parentNode !== tray) {
          tray.appendChild(tile);
          tile.classList.remove("good", "bad", "is-picked");
          clearPicked();
          return;
        }
        enableTapPick(tile);
      });

      tray.appendChild(tile);
    });

    // Build one category box per unique category
    cats.forEach(function (cat) {
      var dz = document.createElement("div");
      dz.className = "dropZone";
      dz.innerHTML =
        '<div class="dzLabel">' + esc(cat) + "</div>" +
        '<div class="dzSlot" data-cat="' + esc(cat) + '" aria-label="Drop items into ' + esc(cat) + '"></div>';
      grid.appendChild(dz);

      var bin = dz.querySelector(".dzSlot");

      // DnD: drop tile into bin (multiple allowed)
      bin.addEventListener("dragover", function (e) { e.preventDefault(); });
      bin.addEventListener("drop", function (e) {
        e.preventDefault();
        var dragged = window.__dragEl;
        if (!dragged || !dragged.classList || !dragged.classList.contains("tile")) return;
        bin.appendChild(dragged);
      });

      // Tap mode: if a tile is picked, place it into this bin
      dz.addEventListener("click", function (e) {
        if (e.target && e.target.closest && e.target.closest(".tile")) return;
        if (!tapPicked) return;
        if (tapPicked.parentNode !== tray) return;
        bin.appendChild(tapPicked);
        clearPicked();
      });
    });

    // Allow dragging back to the tray
    tray.addEventListener("dragover", function (e) { e.preventDefault(); });
    tray.addEventListener("drop", function (e) {
      e.preventDefault();
      var dragged = window.__dragEl;
      if (!dragged || !dragged.classList || !dragged.classList.contains("tile")) return;
      tray.appendChild(dragged);
      dragged.classList.remove("good","bad");
    });

    function hint() {
      fb.className = "fb";
      fb.textContent = cfg.hint || "Tip: think of departments: dairy, frozen, produce, canned goods…";
    }

    function check() {
      // Mark each tile based on the category it is currently in
      var allTiles = box.querySelectorAll(".tile");
      var correct = 0;
      for (var i = 0; i < allTiles.length; i++) {
        var t = allTiles[i];
        var bin = t.parentNode && t.parentNode.classList && t.parentNode.classList.contains("dzSlot") ? t.parentNode : null;
        var placed = bin ? String(bin.dataset.cat || "").trim() : "";
        var good = placed && normalize(placed) === normalize(t.dataset.correct || "");
        t.classList.remove("good","bad");
        t.classList.add(good ? "good" : "bad");
        if (good) correct++;
      }

      var placedAll = tray.querySelectorAll(".tile").length === 0;
      var okAll = placedAll && correct === cfg.items.length;

      if (okAll) {
        award(prefix + "ok", pts);
        fb.className = "fb good";
        fb.textContent = "✅ Great! Everything is in the correct section.";
      } else {
        fb.className = "fb bad";
        fb.textContent = "❌ Not quite. Make sure each item is in the right department (and that all items are placed).";
      }

      renderScore();
      if (ptsEl) ptsEl.textContent = state.earned[prefix + "ok"] ? (pts + " pts") : "0 pts";
    }

    function reset() {
      unawardPrefix(prefix);
      renderMatchDnD(containerId, cfg);
      renderScore();
    }

    if (checkBtn) checkBtn.addEventListener("click", check);
    if (hintBtn) hintBtn.addEventListener("click", hint);
    if (resetBtn) resetBtn.addEventListener("click", reset);
    if (ptsEl) ptsEl.textContent = state.earned[prefix + "ok"] ? (pts + " pts") : "0 pts";
  }

  function renderSignBuilder(containerId, cfg) {
    var box = $(containerId);
    if (!box) return;

    var prefix = cfg.keyPrefix;
    var pts = cfg.pts || 5;
    state.possible += pts;

    var task = cfg.tasks[Math.floor(Math.random() * cfg.tasks.length)];
    var tiles = shuffle(task.tiles);

    box.innerHTML =
      '<h3>' + esc(cfg.title) + "</h3>" +
      '<p class="subline">' + esc(task.prompt) + "</p>" +
      '<div class="callout callout--info"><strong>Goal:</strong> build the sign exactly. Drag OR tap tiles into the blanks.</div>' +
      '<div class="tileTray" id="' + esc(containerId) + '_tiles"></div>' +
      '<div class="poster" style="margin-top:.8rem" id="' + esc(containerId) + '_sign"></div>' +
      '<div class="card__row" style="margin-top:.65rem">' +
        '<div class="points" id="' + esc(containerId) + '_pts">0 pts</div>' +
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap">' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_check">Check</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_hint">Hint</button>' +
          '<button class="btn btn--ghost listenBtn" type="button" id="' + esc(containerId) + '_listen">Listen</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_new">New task</button>' +
          '<button class="btn btn--ghost" type="button" id="' + esc(containerId) + '_reset">Reset</button>' +
        "</div>" +
      "</div>" +
      '<div class="fb" id="' + esc(containerId) + '_fb" aria-live="polite"></div>';

    var tray = $(containerId + "_tiles");
    var sign = $(containerId + "_sign");
    var fb = $(containerId + "_fb");
    var checkBtn = $(containerId + "_check");
    var hintBtn = $(containerId + "_hint");
    var resetBtn = $(containerId + "_reset");
    var newBtn = $(containerId + "_new");
    var listenBtn = $(containerId + "_listen");
    var ptsEl = $(containerId + "_pts");

    tiles.forEach(function (t) {
      var tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.value = t;
      tile.innerHTML = '<span aria-hidden="true">🏷️</span>' + esc(t);
      makeDraggable(tile);
      tile.addEventListener("click", function () { enableTapPick(tile); });
      tray.appendChild(tile);
    });

    // Build sign with blank slots
    var htmlParts = [];
    for (var i = 0; i < task.template.length; i++) {
      var part = task.template[i];
      if (part === "__") {
        htmlParts.push('<span class="dzSlot" data-target="' + esc(task.answer[htmlParts.filter(function(x){return x.indexOf("dzSlot")>-1}).length]) + '" style="display:inline-flex;min-width:110px;margin:.1rem .15rem;vertical-align:middle"></span>');
      } else {
        htmlParts.push(esc(part));
      }
    }
    sign.innerHTML = '<span class="big">TODAY ONLY</span>\n' + htmlParts.join("");

    // Make slots droppable
    var slots = sign.querySelectorAll(".dzSlot");
    for (var s = 0; s < slots.length; s++) {
      makeDroppable(slots[s]);
      slots[s].addEventListener("click", (function (slotEl) {
        return function () { tryTapDrop(slotEl); };
      })(slots[s]));
    }

    function hint() {
      fb.className = "fb";
      fb.textContent = task.hint || "Tip: Start with the discount number, then the product, then the conditions.";
    }

    function check() {
      var ok = 0;
      for (var i2 = 0; i2 < slots.length; i2++) {
        var slot = slots[i2];
        var target = slot.dataset.target;
        var val = String(slot.dataset.value || "").trim();
        var good = val === target;
        if (good) ok++;
        slot.classList.remove("good","bad");
        slot.classList.add(good ? "good" : "bad");
      }
      if (ok === slots.length) {
        var got = award(prefix + "ok", pts);
        fb.className = "fb good";
        fb.textContent = got ? ("✅ Perfect sign! +" + pts + " pts.") : "✅ Correct — already counted.";
        if (ptsEl) ptsEl.textContent = pts + " pts";
      } else {
        fb.className = "fb bad";
        fb.textContent = "Not yet: " + ok + " / " + slots.length + " correct. Fix the red blanks.";
      }
      renderScore();
    }

    function reset() {
      unawardPrefix(prefix);
      renderSignBuilder(containerId, cfg);
      renderScore();
    }

    function newTask() {
      unawardPrefix(prefix);
      renderSignBuilder(containerId, cfg);
      renderScore();
    }

    if (checkBtn) checkBtn.addEventListener("click", check);
    if (hintBtn) hintBtn.addEventListener("click", hint);
    if (resetBtn) resetBtn.addEventListener("click", reset);
    if (newBtn) newBtn.addEventListener("click", newTask);
    if (listenBtn) listenBtn.setAttribute("data-say", task.listen || task.prompt);

    if (ptsEl) ptsEl.textContent = state.earned[prefix + "ok"] ? (pts + " pts") : "0 pts";
  }

  /* ---------------------------
     Section builders
  ----------------------------*/
  function renderGrammar() {
    renderMiniMCQ("connQuiz", {
      keyPrefix: "g_conn_",
      title: "Quick quiz (MCQ): pick the best connector",
      subtitle: "Choose the connector that makes the step-by-step sequence sound natural.",
      ptsPer: 1,
      questions: [
        {
          prompt: "___, choose a recipe.",
          choices: ["First", "Because", "Although"],
          answer: "First",
          hint: "We start a sequence.",
          explain: "Good: 'First' starts instructions."
        },
        {
          prompt: "Make a list. ___, check what you already have at home.",
          choices: ["Then", "However", "Unless"],
          answer: "Then",
          hint: "Next step.",
          explain: "Great for sequences."
        },
        {
          prompt: "I used a coupon ___ I wanted to save money.",
          choices: ["because", "so", "before"],
          answer: "because",
          hint: "Reason",
          explain: "Because = reason."
        },
        {
          prompt: "The store was busy, ___ I went early.",
          choices: ["so", "while", "between"],
          answer: "so",
          hint: "Result",
          explain: "So = result."
        }
      ]
    });

    renderMiniOrder("prepBuilder", {
      keyPrefix: "g_prep_",
      title: "Sentence order: directions in the store",
      subtitle: "Build a correct sentence (drag or tap).",
      chunks: ["It's", "next to", "the dairy section", "in aisle 6."],
      answer: "It's next to the dairy section in aisle 6.",
      hint: "Start with 'It's', then location, then aisle.",
      listenText: "It's next to the dairy section in aisle six.",
      pts: 3
    });

    renderMiniFill("tenseFill", {
      keyPrefix: "g_tense_",
      title: "Fill in the blanks: choose the correct verb form",
      subtitle: "Use the word bank. Focus a blank, then tap a word.",
      bank: ["buy", "am looking", "Chop", "are going to make"],
      items: [
        { label:"Routine", before:"I", after:"vegetables every week.", answer:"buy" },
        { label:"Now", before:"I", after:"for oregano.", answer:"am looking" },
        { label:"Instruction", before:"", after:"the onions.", answer:"Chop" },
        { label:"Plan", before:"We", after:"tacos tonight.", answer:"are going to make" }
      ],
      hint: "Routine = present simple. Now = present continuous. Instructions = imperative. Plan = going to.",
      listenText: "I buy vegetables every week. I am looking for oregano. Chop the onions. We are going to make tacos tonight.",
      pts: 4
    });

    renderMiniMCQ("adjAdvMCQ", {
      keyPrefix: "g_adjadv_",
      title: "Quick quiz (MCQ): adjective or adverb?",
      subtitle: "Choose the best option.",
      ptsPer: 1,
      questions: [
        { prompt:"Cook the sauce ___ (slow / slowly).", choices:["slow","slowly"], answer:"slowly", hint:"How do you cook?", explain:"Adverb describes the verb." },
        { prompt:"This is a ___ meal (quick / quickly).", choices:["quick","quickly"], answer:"quick", hint:"Describes a noun.", explain:"Adjective describes the noun." },
        { prompt:"Cut the vegetables ___ (careful / carefully).", choices:["careful","carefully"], answer:"carefully", hint:"How do you cut?", explain:"Use -ly for adverbs (often)." }
      ]
    });

    renderMiniOrder("compOrder", {
      keyPrefix: "g_comp_",
      title: "Sentence order: compare two products",
      subtitle: "Build a correct comparison sentence.",
      chunks: ["This brand", "is cheaper", "than", "that one."],
      answer: "This brand is cheaper than that one.",
      hint: "Comparative + than.",
      listenText: "This brand is cheaper than that one.",
      pts: 3
    });
  }

  function renderActivities() {
    // 1) Store chooser MCQ
    var recipe = currentRecipe();
    var special = recipe.id === "stirfry"
      ? "soy sauce"
      : (recipe.id === "tacos" ? "fresh tortillas" : "fresh basil");

    renderMiniMCQ("storeChooser", {
      keyPrefix: "a_store_",
      title: "Store choice (MCQ): where should you go?",
      subtitle: "Pick the best place to find the item.",
      ptsPer: 1,
      questions: [
        { prompt: "Where can you usually find " + special + "?", choices:["Asian market","Pharmacy","Hardware store"], answer:"Asian market",
          hint:"Think 'international ingredients'.",
          explain:"Ethnic markets often have specialty ingredients."
        },
        { prompt: "Where can you buy fresh bread?", choices:["Bakery","Electronics store","Toy store"], answer:"Bakery",
          hint:"Made daily.",
          explain:"Bakery = bread, pastries."
        },
        { prompt: "Where is the cheapest place for basic groceries?", choices:["Discount supermarket","Jewelry store","Bookstore"], answer:"Discount supermarket",
          hint:"Look for sales + store brands.",
          explain:"Discount stores focus on low prices."
        }
      ]
    });

    // 2) Aisle match DnD
    renderMatchDnD("aisleMatch", {
      keyPrefix: "a_aisle_",
      title: "Drag & drop (or tap): put each item in the correct section",
      subtitle: "On touch devices: tap a tile, then tap a blank.",
      pts: 5,
      hint: "Frozen = ice cream & peas; dairy = milk & yogurt; produce = fresh fruit/veg.",
      items: [
        { left:"milk", right:"Dairy section" },
        { left:"yogurt", right:"Dairy section" },
        { left:"ice cream", right:"Frozen section" },
        { left:"frozen peas", right:"Frozen section" },
        { left:"apples", right:"Produce section" },
        { left:"carrots", right:"Produce section" }
      ]
    });

    // 3) Direction order (sentence builder)
    renderMiniOrder("directionOrder", {
      keyPrefix: "a_dir_",
      title: "Sentence builder: give directions to an aisle",
      subtitle: "Build a helpful staff answer (drag or tap chunks).",
      chunks: ["Go", "down aisle 5,", "turn right,", "and it's", "on the left."],
      answer: "Go down aisle 5, turn right, and it's on the left.",
      hint: "Start with the verb 'Go', then the aisle, then turn, then location.",
      listenText: "Go down aisle five, turn right, and it's on the left.",
      pts: 3
    });

    // 4) Discount sign builder
    renderSignBuilder("discountSign", {
      keyPrefix: "a_sign_",
      title: "Discount sign maker (drag or tap) — build today’s offers",
      pts: 5,
      tasks: [
        {
          prompt:"Make a sign: 20% off frozen pizzas — today only.",
          template:["\n", "__", " OFF ", "__", "\n", "TODAY ONLY"],
          tiles:["20%","FROZEN PIZZAS","10%","DAIRY","BOGO"],
          answer:["20%","FROZEN PIZZAS"],
          hint:"Put the discount first, then the product.",
          listen:"Today only: twenty percent off frozen pizzas."
        },
        {
          prompt:"Make a sign: Buy 2 get 1 free on yogurt.",
          template:["\n", "__", " on ", "__", "\n", "Limit 1 per customer"],
          tiles:["BUY 2 GET 1 FREE","YOGURT","20% OFF","CHEESE","BUY 1 GET 1"],
          answer:["BUY 2 GET 1 FREE","YOGURT"],
          hint:"Start with the deal, then the product.",
          listen:"Buy two, get one free on yogurt."
        },
        {
          prompt:"Make a sign: €3 off olive oil with coupon.",
          template:["\n", "__", " ", "__", "\n", "WITH COUPON"],
          tiles:["€3 OFF","OLIVE OIL","€1 OFF","PASTA","50% OFF"],
          answer:["€3 OFF","OLIVE OIL"],
          hint:"Match the money discount with the product.",
          listen:"Three euros off olive oil with coupon."
        }
      ]
    });

    // 5) Dialogue fill-in with word bank
    renderMiniFill("dialogueFill", {
      keyPrefix: "a_dlgfill_",
      title: "Fill in the blanks: grocery store mini‑dialogue",
      subtitle: "Use the word bank. Then click Check for instant feedback.",
      bank: ["Excuse", "aisle", "across from", "on display", "coupon", "cashier"],
      items: [
        { label:"1", before:"", after:"me, where can I find rice?", answer:"Excuse" },
        { label:"2", before:"It's in", after:"6, next to the canned goods.", answer:"aisle" },
        { label:"3", before:"The soy sauce is", after:"the international aisle.", answer:"across from" },
        { label:"4", before:"These are", after:"near the entrance.", answer:"on display" },
        { label:"5", before:"Do you take a", after:"?", answer:"coupon" },
        { label:"6", before:"The", after:"can help you at checkout.", answer:"cashier" }
      ],
      hint: "Common phrases: 'Excuse me', 'in aisle', 'across from', 'on display'.",
      listenText: "Excuse me, where can I find rice? It's in aisle six. The soy sauce is across from the international aisle. These are on display near the entrance. Do you take a coupon? The cashier can help you at checkout.",
      pts: 6
    });

    // 6) Checkout roleplay MCQ
    renderMiniMCQ("checkoutRoleplay", {
      keyPrefix: "a_checkout_",
      title: "Checkout roleplay (MCQ): choose the best reply",
      subtitle: "Pick the most natural/polite option.",
      ptsPer: 1,
      questions: [
        {
          prompt:"Cashier: “Do you need a bag?”",
          choices:["Yes, please. Two bags, if possible.","Gimme bag.","No. You bag."],
          answer:"Yes, please. Two bags, if possible.",
          hint:"Polite request.",
          explain:"Use please + softener."
        },
        {
          prompt:"Cashier: “Any coupons today?”",
          choices:["Yes, here you go.","I am coupon.","No couponing."],
          answer:"Yes, here you go.",
          hint:"Simple and natural.",
          explain:"Short, polite reply."
        },
        {
          prompt:"Cashier: “How would you like to pay?”",
          choices:["By card, please.","Paying.","I will pay you."],
          answer:"By card, please.",
          hint:"Payment method + please.",
          explain:"Clear and polite."
        },
        {
          prompt:"Bagger: “Do you want the eggs double‑bagged?”",
          choices:["Yes, please — they’re fragile.","No. Eggs strong.","Eggs? whatever."],
          answer:"Yes, please — they’re fragile.",
          hint:"Use a reason (because/they're).",
          explain:"Great communication."
        }
      ]
    });
  }

  function renderAllActivities() {
    // reset possible before rebuilding entire page points once
    state.possible = 0;
    renderScore();

    try { renderVocab(); } catch(e) { console.error("renderVocab failed", e); }
    try { renderGrammar(); } catch(e) { console.error("renderGrammar failed", e); }
    try { renderActivities(); } catch(e) { console.error("renderActivities failed", e); }
    try { renderDialogues(); } catch(e) { console.error("renderDialogues failed", e); }
    try { renderReading(); } catch(e) { console.error("renderReading failed", e); }

    renderScore();
  }

  /* ---------------------------
     Dialogues
  ----------------------------*/
  var dlgStyle = "polite"; // polite | casual
  var dlgIdx = 0;
  var dlgPos = 0;
  var dlgPts = 0;

  var DIALOGUES = [
    {
      id:"ask_where",
      title:"Ask where something is (aisles)",
      polite: {
        clerk: [
          "Hi there! Can I help you find something?",
          "Sure — what are you looking for?",
          "It's in aisle 6, across from the dairy section.",
          "You're welcome. Anything else?"
        ],
        customerPrompts: [
          { prompt:"You need rice.", good:"Excuse me, could you tell me where I can find rice?", bad:["Where rice?","I want rice."] },
          { prompt:"Ask for a direction.", good:"Could you please show me on the map?", bad:["Show me map.","Map."] },
          { prompt:"Thank them.", good:"Thank you — that really helps.", bad:["Ok.","Whatever."] }
        ]
      },
      casual: {
        clerk: [
          "Hey! Need help?",
          "Sure — what do you need?",
          "Aisle 6, near dairy.",
          "No problem!"
        ],
        customerPrompts: [
          { prompt:"You need rice.", good:"Hey, where's the rice?", bad:["Rice now.","Give rice."] },
          { prompt:"Ask for a direction.", good:"Can you point me to it?", bad:["Point.","Do it."] },
          { prompt:"Thank them.", good:"Thanks!", bad:["Ok."] }
        ]
      }
    },
    {
      id:"discounts",
      title:"Ask about discounts & coupons",
      polite: {
        clerk: [
          "Hello! Are you finding everything okay?",
          "Yes — today we have offers in the frozen section.",
          "We accept manufacturer coupons, and there's a loyalty discount too.",
          "Great — your total will reflect the discount."
        ],
        customerPrompts: [
          { prompt:"Ask about offers.", good:"Hi, are there any discounts today?", bad:["Discounts?","Give me cheaper."] },
          { prompt:"Ask about coupons.", good:"Do you accept coupons?", bad:["You take coupon?","Coupons!"] },
          { prompt:"Ask if the discount is applied.", good:"Could you confirm the discount was applied, please?", bad:["Applied?","Do it."] }
        ]
      },
      casual: {
        clerk: [
          "Hey! Need anything?",
          "Yeah, frozen stuff is on sale.",
          "Coupons work — and members get a discount.",
          "All set!"
        ],
        customerPrompts: [
          { prompt:"Ask about offers.", good:"Any deals today?", bad:["Deals now.","Sale?"] },
          { prompt:"Ask about coupons.", good:"Do you take coupons?", bad:["Coupons?","Take it."] },
          { prompt:"Ask if the discount is applied.", good:"Did it apply the discount?", bad:["Discount?","You did?"] }
        ]
      }
    },
    {
      id:"checkout",
      title:"Checkout: bags, payment, receipt",
      polite: {
        clerk: [
          "Hi! Did you find everything?",
          "Would you like a bag today?",
          "How would you like to pay?",
          "Here’s your receipt. Have a nice day!"
        ],
        customerPrompts: [
          { prompt:"Ask for two bags.", good:"Yes, please. Two bags, if possible.", bad:["Bags.","Give two bags."] },
          { prompt:"Pay by card.", good:"By card, please.", bad:["Card.","I pay card."] },
          { prompt:"Ask for the receipt.", good:"May I have the receipt, please?", bad:["Receipt.","Give receipt."] }
        ]
      },
      casual: {
        clerk: [
          "Hey! All good?",
          "Need a bag?",
          "Paying how?",
          "Receipt’s in the bag — have a good one!"
        ],
        customerPrompts: [
          { prompt:"Ask for two bags.", good:"Yeah, two bags please.", bad:["Bags now.","Two."] },
          { prompt:"Pay by card.", good:"Card, please.", bad:["Card.","Pay."] },
          { prompt:"Ask for the receipt.", good:"Can I get the receipt?", bad:["Receipt!"] }
        ]
      }
    }
  ];

  function renderDialogues() {
    var sceneSel = $("dlgScene");
    if (!sceneSel) return;

    // dialogues scoring: 1 pt per correct reply + 2 pts for speaking "I said it" once
    // We'll add possible points here:
    var possible = (3 * 1) + 2; // per scene max (3 replies + speaking)
    // We'll count once: user can play multiple scenes but max points for each scene.
    // Total possible = sum scenes.
    state.possible += possible * DIALOGUES.length;

    // Fill scenes
    sceneSel.innerHTML = "";
    DIALOGUES.forEach(function (d, i) {
      var opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = d.title;
      sceneSel.appendChild(opt);
    });

    // Keep scene selection stable
    sceneSel.value = String(clamp(dlgIdx, 0, DIALOGUES.length - 1));

    // Style buttons
    var politeBtn = $("dlgPolite");
    var casualBtn = $("dlgCasual");
    if (politeBtn && casualBtn) {
      politeBtn.setAttribute("aria-pressed", dlgStyle === "polite" ? "true" : "false");
      casualBtn.setAttribute("aria-pressed", dlgStyle === "casual" ? "true" : "false");
    }

    function startScene() {
      dlgPos = 0;
      dlgPts = 0;
      renderDialogueLog(true);
      renderDialogueChoices();
      updateDlgPts();
    }

    function sceneData() {
      var scene = DIALOGUES[dlgIdx];
      return dlgStyle === "polite" ? scene.polite : scene.casual;
    }

    function renderDialogueLog(reset) {
      var log = $("dlgLog");
      if (!log) return;
      if (reset) log.innerHTML = "";
      // Add clerk line for current step
      var scene = sceneData();
      var line = scene.clerk[Math.min(dlgPos, scene.clerk.length - 1)];
      addLine(log, "Clerk", line, "clerk");
      speak(line);
    }

    function addLine(log, who, txt, cls) {
      var div = document.createElement("div");
      div.className = "line " + cls;
      div.innerHTML = '<div class="who">' + esc(who) + '</div><div class="txt">' + esc(txt) + '</div>';
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    function renderDialogueChoices() {
      var choicesBox = $("dlgChoices");
      var prompt = $("dlgPrompt");
      if (!choicesBox || !prompt) return;

      var scene = sceneData();
      var p = scene.customerPrompts[dlgPos];
      if (!p) {
        prompt.textContent = "Scene complete ✅";
        choicesBox.innerHTML = "";
        return;
      }
      prompt.textContent = p.prompt;

      var options = shuffle([p.good].concat(p.bad));
      choicesBox.innerHTML = "";
      options.forEach(function (opt) {
        var b = document.createElement("button");
        b.className = "choiceBtn";
        b.type = "button";
        b.textContent = opt;
        b.addEventListener("click", function () {
          // Prevent rapid double-clicks (keeps the dialogue order clean)
          var all = choicesBox.querySelectorAll("button.choiceBtn");
          for (var k = 0; k < all.length; k++) all[k].disabled = true;

          if (opt === p.good) {
            // Record customer line only when correct (avoids confusing log order)
            var log = $("dlgLog");
            if (log) addLine(log, "You", opt, "cust");

            b.classList.add("good");
            var got = award("dlg_" + DIALOGUES[dlgIdx].id + "_r" + dlgPos, 1);
            if (got) dlgPts += 1;

            // Move forward: next clerk line
            dlgPos += 1;
            renderDialogueLog(false);
            renderDialogueChoices();
          } else {
            // Wrong attempt: show feedback but DON'T add to the log
            b.classList.add("bad");
            var fb = $("dlgSpeakFb");
            if (fb) {
              fb.className = "fb bad";
              fb.textContent = "Try a more polite / natural phrase.";
            }
            // Let them try again
            for (var k2 = 0; k2 < all.length; k2++) all[k2].disabled = false;
          }
          updateDlgPts();
        });
        choicesBox.appendChild(b);
      });
    }

    function updateDlgPts() {
      var ptsEl = $("dlgPts");
      if (!ptsEl) return;
      // compute earned for this scene
      var id = DIALOGUES[dlgIdx].id;
      var totalEarned = 0;
      for (var i = 0; i < 3; i++) {
        if (state.earned["dlg_" + id + "_r" + i]) totalEarned += 1;
      }
      if (state.earned["dlg_" + id + "_speak"]) totalEarned += 2;
      ptsEl.textContent = totalEarned + " pts";
      renderScore();
    }

    sceneSel.addEventListener("change", function () {
      dlgIdx = parseInt(sceneSel.value, 10) || 0;
      startScene();
    });

    var restartBtn = $("dlgRestart");
    if (restartBtn) restartBtn.addEventListener("click", startScene);

    if (politeBtn && casualBtn) {
      politeBtn.addEventListener("click", function () {
        dlgStyle = "polite";
        politeBtn.setAttribute("aria-pressed", "true");
        casualBtn.setAttribute("aria-pressed", "false");
        startScene();
      });
      casualBtn.addEventListener("click", function () {
        dlgStyle = "casual";
        politeBtn.setAttribute("aria-pressed", "false");
        casualBtn.setAttribute("aria-pressed", "true");
        startScene();
      });
    }

    var readLastBtn = $("dlgReadLast");
    if (readLastBtn) {
      readLastBtn.addEventListener("click", function () {
        var log = $("dlgLog");
        if (!log) return;
        var lines = log.querySelectorAll(".line .txt");
        if (!lines.length) return;
        speak(lines[lines.length - 1].textContent);
      });
    }

    var spBtn = $("dlgPromptBtn");
    var saidBtn = $("dlgSaidBtn");
    if (spBtn) spBtn.addEventListener("click", function () {
      var prompts = [
        "Excuse me, where can I find the frozen vegetables?",
        "Do you accept coupons today?",
        "Could I have two bags, please?",
        "Is this item on sale?",
        "Could you double-bag the eggs, please?"
      ];
      var p = prompts[Math.floor(Math.random() * prompts.length)];
      var fb = $("dlgSpeakFb");
      if (fb) { fb.className = "fb"; fb.textContent = "Say: “" + p + "”"; }
      speak(p);
    });

    if (saidBtn) saidBtn.addEventListener("click", function () {
      var id = DIALOGUES[dlgIdx].id;
      var got = award("dlg_" + id + "_speak", 2);
      var fb = $("dlgSpeakFb");
      if (fb) {
        fb.className = "fb " + (got ? "good" : "");
        fb.textContent = got ? "Nice! +2 pts (speaking)." : "Already counted for this scene.";
      }
      updateDlgPts();
    });

    startScene();
  }

  /* ---------------------------
     Reading
  ----------------------------*/
  var FLYER = {
    title: "WEEKLY GROCERY DEALS",
    lines: [
      "• 20% off frozen vegetables (Mon–Wed)",
      "• Buy 2 get 1 free: yogurt (limit 1 per customer)",
      "• €3 off olive oil with coupon",
      "• Fresh bread: 2 for €4 at the bakery",
      "• Opening hours: Mon–Sat 08:00–20:00 · Sun 09:00–13:00",
      "• Self-checkout available · Loyalty card = extra 5% off"
    ]
  };

  function flyerText() {
    return FLYER.title + ". " + FLYER.lines.join(" ");
  }

  function renderReading() {

    var poster = $("flyerPoster");
    if (poster) {
      poster.innerHTML =
        '<span class="big">' + esc(FLYER.title) + "</span>\n" +
        FLYER.lines.map(function (l) { return esc(l); }).join("\n");
    }

    var listenBtn = $("btnListenFlyer");
    if (listenBtn) listenBtn.setAttribute("data-say", flyerText());

    var hintBtn = $("btnFlyerHint");
    var hintEl = $("flyerHint");
    if (hintBtn && hintEl) {
      hintBtn.addEventListener("click", function () {
        hintEl.textContent = "Hint: look for numbers (20%, €3), days (Mon–Wed), and hours (08:00–20:00).";
      });
    }

    renderMiniMCQ("flyerMCQ", {
      keyPrefix: "r_mcq_",
      title: "MCQ: answer from the flyer",
      subtitle: "Choose the correct answer using the flyer above.",
      ptsPer: 1,
      questions: [
        { prompt:"What is 20% off?", choices:["Frozen vegetables","Olive oil","Fresh bread"], answer:"Frozen vegetables", hint:"See first line.", explain:"The first line mentions it." },
        { prompt:"What deal is for yogurt?", choices:["Buy 2 get 1 free","€3 off with coupon","2 for €4"], answer:"Buy 2 get 1 free", hint:"Second line.", explain:"Yogurt has B2G1." },
        { prompt:"When is the store open on Sunday?", choices:["09:00–13:00","08:00–20:00","Closed"], answer:"09:00–13:00", hint:"Hours line.", explain:"Sunday has shorter hours." },
        { prompt:"What gives an extra 5% off?", choices:["Loyalty card","Cash payment","No bags"], answer:"Loyalty card", hint:"Last line.", explain:"Loyalty card = extra discount." }
      ]
    });

    state.possible += 2; // True/False (2 statements)

    // True/False
    var tf = $("flyerTF");
    if (!tf) return;

    tf.innerHTML =
      '<h3>True / False</h3>' +
      '<p class="subline">Tap an answer. You get points for correct answers.</p>' +
      '<div class="mcq" id="tfBox"></div>' +
      '<div class="card__row" style="margin-top:.6rem">' +
        '<div class="points" id="tfPts">0 pts</div>' +
        '<button class="btn btn--ghost" type="button" id="tfReset">Reset</button>' +
      "</div>";

    var tfBox = $("tfBox");
    var tfPts = $("tfPts");
    var tfReset = $("tfReset");
    var statements = [
      { s:"The olive oil discount requires a coupon.", a:true, key:"r_tf_0" },
      { s:"The store is open until 20:00 on Sunday.", a:false, key:"r_tf_1" }
    ];

    function updateTfPts() {
      var p = 0;
      statements.forEach(function (st) { if (state.earned[st.key]) p += 1; });
      if (tfPts) tfPts.textContent = p + " pts";
      renderScore();
    }

    function resetTf() {
      statements.forEach(function (st) { delete state.earned[st.key]; });
      saveState();
      renderReading(); // rerender
      renderScore();
    }

    statements.forEach(function (st, idx) {
      var q = document.createElement("div");
      q.className = "q";
      q.innerHTML =
        '<div class="q__title">' + esc(st.s) + "</div>" +
        '<div class="choices"></div>' +
        '<div class="q__meta" id="tfMeta' + idx + '"></div>';
      tfBox.appendChild(q);

      var choices = q.querySelector(".choices");
      ["True", "False"].forEach(function (label) {
        var b = document.createElement("button");
        b.className = "choiceBtn";
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", function () {
          var meta = $("tfMeta" + idx);
          var pick = (label === "True");
          // clear styles
          var all = choices.querySelectorAll(".choiceBtn");
          for (var i = 0; i < all.length; i++) all[i].classList.remove("good","bad");

          if (pick === st.a) {
            b.classList.add("good");
            if (meta) meta.textContent = "✅ Correct.";
            award(st.key, 1);
            updateTfPts();
          } else {
            b.classList.add("bad");
            if (meta) meta.textContent = "❌ Not correct. Check the hours/conditions line.";
          }
        });
        choices.appendChild(b);
      });
    });

    if (tfReset) tfReset.addEventListener("click", resetTf);
    updateTfPts();
  }

  /* ---------------------------
     Wrap speaking pack
  ----------------------------*/
  function bindSpeakPack() {
    var btn = $("btnSpeakPack");
    var out = $("speakPack");
    if (!btn || !out) return;
    btn.addEventListener("click", function () {
      var items = shoppingItems().map(function (it) { return it.name; });
      var picks = shuffle(items).slice(0, 6);
      var qs = [
        "Excuse me, where can I find " + picks[0] + "?",
        "Is " + picks[1] + " on sale today?",
        "Could you tell me which aisle has " + picks[2] + "?",
        "Do you accept coupons for " + picks[3] + "?",
        "Could I have two bags, please?",
        "Could you double-bag the " + picks[4] + ", please?",
        "Which is cheaper, brand A or brand B?",
        "I’m looking for " + picks[5] + ". Is it near the dairy section?",
        "Can I pay by card?",
        "May I have the receipt, please?",
        "Is self-checkout available?",
        "Where is the shortest line?"
      ];
      out.innerHTML = qs.map(function (q) { return '<div class="sp">• ' + esc(q) + ' <button class="smallBtn listenBtn" type="button" data-say="' + esc(q) + '">Listen</button></div>'; }).join("");
      award("wrap_pack", 2);
      renderScore();
    });
  }

  /* ---------------------------
     Buttons: resets + help + accent
  ----------------------------*/
  function bindGlobalControls() {
    var r1 = $("resetAllTop");
    var r2 = $("resetAllBottom");
    if (r1) r1.addEventListener("click", resetAll);
    if (r2) r2.addEventListener("click", resetAll);

    var us = $("voiceUS");
    var uk = $("voiceUK");
    if (us) us.addEventListener("click", function () { setAccent("us"); speak("American voice selected."); });
    if (uk) uk.addEventListener("click", function () { setAccent("uk"); speak("British voice selected."); });

    // Help modal
    var dlg = $("helpDialog");
    var helpBtn = $("btnHelp");
    var closeBtn = $("closeHelp");
    if (helpBtn && dlg) helpBtn.addEventListener("click", function () { dlg.showModal(); });
    if (closeBtn && dlg) closeBtn.addEventListener("click", function () { dlg.close(); });
  }

  /* ---------------------------
     Print: Grammar only
  ----------------------------*/
  function printGrammarSection() {
    document.body.classList.add("cq-print-grammar");

    function cleanup() {
      document.body.classList.remove("cq-print-grammar");
      window.removeEventListener("afterprint", cleanup);
    }

    window.addEventListener("afterprint", cleanup);

    window.print();

    // Fallback cleanup (some browsers don't always fire afterprint)
    setTimeout(function () {
      try { cleanup(); } catch (e) {}
    }, 1200);
  }

  /* ---------------------------
     Init
  ----------------------------*/
  function init() {
    loadState();

    // Accent UI
    setAccent(state.accent);

    // Speech voices load
    if ("speechSynthesis" in window) {
      speechSynthesis.onvoiceschanged = function () {
        speechReady = true;
        ensureVoice();
      };
      // also call once now
      ensureVoice();
    }

    setTapModePill(true);

    bindSpeechButtons();
    bindGlobalControls();

    // Print grammar
    var btnPrintGrammar = document.getElementById("btnPrintGrammar");
    if (btnPrintGrammar) btnPrintGrammar.addEventListener("click", printGrammarSection);

    initRecipeUI();
    renderShoppingList();
    bindListControls();
    bindSpeakMini();

    bindVocabControls();
    renderVocab();

    // Build all interactive sections and compute possible points.
    // Note: renderAllActivities resets possible and re-adds points.
    renderAllActivities();

    bindSpeakPack();

    // If we already have points from storage, update possible and score view.
    // possible is computed by renderAllActivities, score loaded by loadState.
    renderScore();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
