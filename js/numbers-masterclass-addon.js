/* SpeakEasyTisha — Numbers Masterclass Add-On
   0 vs “O”, phone dictation, room numbers, big numbers (US/UK “and”), spelling (emails/addresses), money (USD/GBP).
   Touch-friendly, instant feedback, score, US/UK speech synthesis with 0-style toggle. */

(function(){
  "use strict";

  /* ---------- helpers ---------- */
  function $(id){ return document.getElementById(id); }
  function $$ (sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function normDigits(s){ return String(s||"").replace(/[^\d]/g,""); }
  function setFeedback(el, kind, html){
    el.classList.remove("good","bad");
    if(kind) el.classList.add(kind);
    el.innerHTML = html || "";
  }
  function htmlEscape(s){
    return String(s).replace(/[&<>"]/g,function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c];
    });
  }

  /* ---------- score ---------- */
  var score = 0;
  var total = 0;
  function bumpTotal(){ total++; $("total").textContent = String(total); }
  function bumpScore(){ score++; $("score").textContent = String(score); }

  /* ---------- speech synthesis ---------- */
  var voices = [];
  var chosenVoice = null;

  function getAccent(){ return $("accent").value; } // us / uk
  function getRate(){ return parseFloat($("rate").value || "1") || 1; }
  function getZeroStyle(){ return $("zeroStyle").value; } // oh / zero / nought

  function pickVoice(){
    var accent = getAccent();
    var prefLang = (accent === "uk") ? "en-GB" : "en-US";
    var fallbackLang = "en";

    voices = speechSynthesis.getVoices() || [];
    if(!voices.length){ chosenVoice = null; return; }

    // Prefer exact language match
    var cand = voices.filter(function(v){ return (v.lang || "").toLowerCase() === prefLang.toLowerCase(); });
    // If none, try startsWith
    if(!cand.length){
      cand = voices.filter(function(v){ return (v.lang || "").toLowerCase().indexOf(prefLang.toLowerCase()) === 0; });
    }
    // If still none, any English
    if(!cand.length){
      cand = voices.filter(function(v){ return (v.lang || "").toLowerCase().indexOf(fallbackLang) === 0; });
    }
    chosenVoice = cand[0] || voices[0] || null;
  }

  function speak(text){
    try{
      if(!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      if(!voices.length) voices = speechSynthesis.getVoices() || [];
      if(!chosenVoice) pickVoice();
      if(chosenVoice) u.voice = chosenVoice;
      u.rate = clamp(getRate(), 0.8, 1.2);
      u.pitch = 1;
      u.volume = 1;
      speechSynthesis.speak(u);
    }catch(e){
      // fail silently
    }
  }

  function stopSpeak(){
    try{ speechSynthesis.cancel(); }catch(e){}
  }

  function initVoices(){
    pickVoice();
    if("onvoiceschanged" in speechSynthesis){
      speechSynthesis.onvoiceschanged = function(){ pickVoice(); };
    }
  }

  /* ---------- number reading helpers ---------- */
  function digitWord(d){
    var z = getZeroStyle();
    if(d === "0"){
      if(z === "zero") return "zero";
      if(z === "nought") return "nought";
      return "oh";
    }
    var map = {"1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine"};
    return map[d] || d;
  }

  function sayDigitsAsWords(digits){
    return String(digits).split("").map(digitWord).join(" ");
  }

  /* ---------- 1) 0 vs O quiz ---------- */
  var zeroQn = 0;
  var zeroCurrent = null;

  var zeroQuizBank = [
    {digits:"204", ctx:"Room number", us:"two oh four", uk:"two oh four", note:"In hotels, 0 is often “oh”. You may also hear “two zero four” for clarity."},
    {digits:"1005", ctx:"Door code", us:"one oh oh five", uk:"one oh oh five", note:"Codes often use “oh” for 0; some people prefer “zero” for security."},
    {digits:"505", ctx:"Extension", us:"five oh five", uk:"five oh five", note:"Extensions are often read as digit-by-digit."},
    {digits:"02108", ctx:"ZIP/Postal code", us:"zero two one zero eight", uk:"oh two one oh eight", note:"US ZIPs often use “zero.” UK postcodes often start with letters; if digits appear, “oh” is common."},
    {digits:"2001", ctx:"Year", us:"two thousand one", uk:"two thousand and one", note:"UK commonly includes “and” with 1–99 after hundred/thousand in some styles."},
    {digits:"09", ctx:"Time", us:"oh nine", uk:"oh nine", note:"Times with leading 0 are usually said “oh …” (oh nine, oh five)."},
    {digits:"101", ctx:"Route / room", us:"one oh one", uk:"one oh one", note:"Room numbers and routes often use “oh” for the middle 0."}
  ];

  function renderZeroChips(){
    var items = ["204","1005","07000","020 7946 0958","415-555-0123","Room 302","Code 9007"];
    var wrap = $("zeroChips");
    wrap.innerHTML = "";
    items.forEach(function(t){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = t;
      b.addEventListener("click", function(){
        speak("Try: " + sayDigitsAsWords(normDigits(t)));
      });
      wrap.appendChild(b);
    });
  }

  function zeroNewQuestion(){
    zeroQn++;
    $("zeroQn").textContent = String(zeroQn);

    var item = zeroQuizBank[Math.floor(Math.random()*zeroQuizBank.length)];
    zeroCurrent = item;

    $("zeroDigits").textContent = item.ctx + ": " + item.digits;
    setFeedback($("zeroFeedback"), "", "Tap the best option for <strong>" + htmlEscape(getAccent()==="uk"?"UK":"US") + "</strong>.");

    var accent = getAccent();
    var correct = (accent === "uk") ? item.uk : item.us;

    // Build distractors
    var d1 = sayDigitsAsWords(item.digits); // digit-by-digit
    var d2 = item.digits.split("").join(" "); // raw digits (not good but distractor)
    var d3 = correct.replace(/\boh\b/g,"zero"); // alternative
    var options = [correct, d1, d2, d3].filter(function(v,i,a){ return a.indexOf(v)===i; });
    options = shuffle(options).slice(0,4);

    var optWrap = $("zeroOptions");
    optWrap.innerHTML = "";
    options.forEach(function(txt){
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt";
      btn.innerHTML = "🗣️ " + htmlEscape(txt);
      btn.addEventListener("click", function(){
        bumpTotal();
        var isCorrect = (txt === correct);
        if(isCorrect){
          bumpScore();
          setFeedback($("zeroFeedback"), "good", "✅ Correct. <strong>" + htmlEscape(correct) + "</strong><br><span class='muted'>" + htmlEscape(item.note) + "</span>");
        }else{
          setFeedback($("zeroFeedback"), "bad", "❌ Not the best choice. Best for " + (accent==="uk"?"UK":"US") + ": <strong>" + htmlEscape(correct) + "</strong><br><span class='muted'>" + htmlEscape(item.note) + "</span>");
        }
      });
      optWrap.appendChild(btn);
    });
  }

  function zeroSpeak(){
    if(!zeroCurrent) return;
    var accent = getAccent();
    var correct = (accent === "uk") ? zeroCurrent.uk : zeroCurrent.us;
    speak(zeroCurrent.ctx + ". " + correct + ".");
  }

  /* ---------- 2) Phone dictation ---------- */
  var phoneCurrentDigits = "";
  var phoneCurrentFormat = "";
  var chunkAnswer = [];

  function genUSPhone(){
    // Keep a 0 somewhere to reinforce "oh"
    var a = String(200 + Math.floor(Math.random()*700)); // 200-899
    var b = String(200 + Math.floor(Math.random()*700));
    var c = String(Math.floor(Math.random()*9000)).padStart(4,"0");
    // Encourage zeros
    if(Math.random()<0.55){
      c = c.substring(0,2) + "0" + c.substring(3);
    }
    return (a+b+c);
  }

  function genUKPhone(){
    // Simple UK patterns for training (not validating all real allocations)
    // 07xxx xxxxxx (mobile) or 020 xxxx xxxx (London)
    if(Math.random()<0.55){
      var p1 = "07" + String(Math.floor(Math.random()*900)+100); // 07 + 3 digits
      var p2 = String(Math.floor(Math.random()*900000)+100000); // 6 digits
      return normDigits(p1+p2);
    }else{
      var p1b = "020";
      var p2b = String(Math.floor(Math.random()*9000)+1000);
      var p3b = String(Math.floor(Math.random()*9000)+1000);
      return normDigits(p1b+p2b+p3b);
    }
  }

  function formatPhone(digits){
    var accent = getAccent();
    if(accent==="us"){
      return digits.slice(0,3) + "-" + digits.slice(3,6) + "-" + digits.slice(6);
    }
    // UK: if starts with 020 => 020 xxxx xxxx, else 07xxx xxxxxx
    if(digits.indexOf("020")===0 && digits.length===11){
      return "020 " + digits.slice(3,7) + " " + digits.slice(7);
    }
    if(digits.indexOf("07")===0 && digits.length===11){
      return digits.slice(0,5) + " " + digits.slice(5);
    }
    // fallback
    return digits;
  }

  function phoneNew(){
    var accent = getAccent();
    phoneCurrentDigits = (accent==="us") ? genUSPhone() : genUKPhone();
    phoneCurrentFormat = formatPhone(phoneCurrentDigits);
    $("phoneFormat").textContent = "Format: " + phoneCurrentFormat;
    $("phoneInput").value = "";
    setFeedback($("phoneFeedback"), "", "Click <strong>Listen</strong>, then type the digits.");
    phoneBuildNewChunks();
  }

  function phoneSpeak(){
    if(!phoneCurrentDigits) return;
    // Speak with mild chunking
    var accent = getAccent();
    var d = phoneCurrentDigits;
    var text;
    if(accent==="us" && d.length===10){
      text = sayDigitsAsWords(d.slice(0,3)) + ". " + sayDigitsAsWords(d.slice(3,6)) + ". " + sayDigitsAsWords(d.slice(6));
    }else if(accent==="uk" && d.length===11){
      if(d.indexOf("020")===0){
        text = sayDigitsAsWords("020") + ". " + sayDigitsAsWords(d.slice(3,7)) + ". " + sayDigitsAsWords(d.slice(7));
      }else{
        text = sayDigitsAsWords(d.slice(0,5)) + ". " + sayDigitsAsWords(d.slice(5));
      }
    }else{
      text = sayDigitsAsWords(d);
    }
    speak("Phone number. " + text + ".");
  }

  function phoneReveal(){
    if(!phoneCurrentDigits) return;
    setFeedback($("phoneFeedback"), "", "Answer: <strong>" + htmlEscape(phoneCurrentFormat) + "</strong>");
  }

  function phoneCheck(){
    if(!phoneCurrentDigits) return;
    bumpTotal();

    var typed = normDigits($("phoneInput").value);
    if(typed === phoneCurrentDigits){
      bumpScore();
      setFeedback($("phoneFeedback"), "good", "✅ Perfect! <strong>" + htmlEscape(phoneCurrentFormat) + "</strong>");
    }else{
      // show mismatch hint
      var hint = "❌ Not quite. Expected <strong>" + htmlEscape(phoneCurrentFormat) + "</strong> but you typed <strong>" + htmlEscape(formatPhone(typed)) + "</strong>.";
      setFeedback($("phoneFeedback"), "bad", hint);
    }
  }

  function phoneClear(){
    $("phoneInput").value = "";
    setFeedback($("phoneFeedback"), "", "Cleared. Click <strong>Listen</strong> again.");
  }

  /* ---------- 2B) Chunking trainer ---------- */
  var chunkTarget = "";
  var chunkCorrectOrder = [];

  function phoneBuildNewChunks(){
    var d = phoneCurrentDigits;
    if(!d) return;
    var accent = getAccent();
    var chunks = [];
    if(accent==="us" && d.length===10){
      chunks = [d.slice(0,3), d.slice(3,6), d.slice(6)];
    }else if(accent==="uk" && d.length===11){
      if(d.indexOf("020")===0){
        chunks = ["020", d.slice(3,7), d.slice(7)];
      }else{
        chunks = [d.slice(0,5), d.slice(5)];
      }
    }else{
      chunks = [d];
    }
    chunkCorrectOrder = chunks.slice();
    chunkTarget = formatPhone(d);
    $("chunkTarget").textContent = "Target (visual): " + chunkTarget;

    // add a couple distractor chunks by shuffling digits slightly
    var bank = chunks.slice();
    if(chunks.length >= 3){
      bank.push(chunks[1] + "");
      bank.push(chunks[0].slice(0, Math.max(2, chunks[0].length-1)) + "9");
    }else{
      bank.push(String(Math.floor(Math.random()*900)+100));
      bank.push("0" + String(Math.floor(Math.random()*900)+100));
    }
    bank = shuffle(bank).filter(function(v,i,a){ return a.indexOf(v)===i; });

    chunkAnswer = [];
    renderChunkBank(bank);
    renderChunkAnswer();
    setFeedback($("chunkFeedback"), "", "Tap chunks in the correct order.");
  }

  function renderChunkBank(bank){
    var wrap = $("chunkBank");
    wrap.innerHTML = "";
    bank.forEach(function(ch){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = ch;
      b.addEventListener("click", function(){
        chunkAnswer.push(ch);
        renderChunkAnswer();
      });
      wrap.appendChild(b);
    });
  }

  function renderChunkAnswer(){
    if(!chunkAnswer.length){
      $("chunkAnswer").textContent = "Tap chunks above…";
      return;
    }
    $("chunkAnswer").textContent = chunkAnswer.join(" ");
  }

  function chunkReset(){
    chunkAnswer = [];
    renderChunkAnswer();
    setFeedback($("chunkFeedback"), "", "Reset. Try again.");
  }

  function chunkSpeak(){
    phoneSpeak();
  }

  function chunkCheck(){
    if(!phoneCurrentDigits) return;
    bumpTotal();
    var ok = (chunkAnswer.join("|") === chunkCorrectOrder.join("|"));
    if(ok){
      bumpScore();
      setFeedback($("chunkFeedback"), "good", "✅ Great chunking! That’s a very natural way to group the number.");
    }else{
      setFeedback($("chunkFeedback"), "bad", "❌ Try a different order. Hint: follow the visual format: <strong>" + htmlEscape(chunkTarget) + "</strong>");
    }
  }

  /* ---------- 3) Room numbers listening ---------- */
  var roomDigits = "";
  var roomCorrect = "";

  function genRoom(){
    // 3-4 digit rooms with occasional zero
    var n;
    if(Math.random()<0.5){
      n = String(Math.floor(Math.random()*900)+100); // 100-999
    }else{
      n = String(Math.floor(Math.random()*9000)+1000); // 1000-9999
    }
    // add a 0
    if(n.length >= 3 && Math.random()<0.6){
      var pos = 1 + Math.floor(Math.random()*(n.length-1));
      n = n.substring(0,pos) + "0" + n.substring(pos+1);
    }
    return n;
  }

  function roomNew(){
    roomDigits = genRoom();
    roomCorrect = roomDigits;
    $("roomPrompt").textContent = "—";
    setFeedback($("roomFeedback"), "", "Click <strong>Listen</strong>, then choose the correct room.");

    // options: correct + 3 close distractors
    var opts = [roomCorrect];
    while(opts.length < 4){
      var d = genRoom();
      if(opts.indexOf(d) === -1) opts.push(d);
    }
    opts = shuffle(opts);

    var wrap = $("roomOptions");
    wrap.innerHTML = "";
    opts.forEach(function(o){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.innerHTML = "🏷️ Room <strong>" + htmlEscape(o) + "</strong>";
      b.addEventListener("click", function(){
        bumpTotal();
        if(o === roomCorrect){
          bumpScore();
          $("roomPrompt").textContent = "Room " + roomCorrect;
          setFeedback($("roomFeedback"), "good", "✅ Yes — Room <strong>" + htmlEscape(roomCorrect) + "</strong>");
        }else{
          $("roomPrompt").textContent = "Room " + roomCorrect;
          setFeedback($("roomFeedback"), "bad", "❌ Not that one. It was <strong>" + htmlEscape(roomCorrect) + "</strong>.");
        }
      });
      wrap.appendChild(b);
    });
  }

  function roomSpeak(){
    if(!roomCorrect) return;
    speak("Your room number is " + sayDigitsAsWords(roomCorrect) + ".");
  }

  function renderRoomPhrases(){
    var phrases = [
      "It’s room 204 — second floor.",
      "Your room is 1005, elevator to the right.",
      "The code is 9007.",
      "Could you repeat the room number, please?",
      "Is that two-oh-four or two-zero-four?"
    ];
    var wrap = $("roomPhrases");
    wrap.innerHTML = "";
    phrases.forEach(function(p){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = p;
      b.addEventListener("click", function(){ speak(p); });
      wrap.appendChild(b);
    });
  }

  /* ---------- 4) Big numbers: US vs UK “and” ---------- */
  var bigCurrent = null;

  function numToWords_0_999(n, useAnd){
    n = Math.floor(n);
    var ones = ["zero","one","two","three","four","five","six","seven","eight","nine"];
    var teens = ["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
    var tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];

    if(n < 10) return ones[n];
    if(n < 20) return teens[n-10];
    if(n < 100){
      var t = Math.floor(n/10), r = n%10;
      return tens[t] + (r?(" " + ones[r]):"");
    }
    var h = Math.floor(n/100), rem = n%100;
    if(rem === 0) return ones[h] + " hundred";
    return ones[h] + " hundred" + (useAnd ? " and " : " ") + numToWords_0_999(rem, useAnd);
  }

  function bigNew(){
    // choose 3-4 digit numbers with tricky parts
    var candidates = [105, 110, 115, 342, 999, 1001, 1205, 1500, 2006, 3210, 9807, 1250, 1409];
    var n = candidates[Math.floor(Math.random()*candidates.length)];
    bigCurrent = { n:n };

    $("bigDigits").textContent = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setFeedback($("bigFeedback"), "", "Pick the best option for <strong>" + (getAccent()==="uk"?"UK":"US") + "</strong>.");

    var us = (n < 1000)
      ? numToWords_0_999(n, false)
      : (function(){
          var th = Math.floor(n/1000), rem = n%1000;
          var base = numToWords_0_999(th,false) + " thousand";
          if(rem === 0) return base;
          if(rem < 100) return base + " " + numToWords_0_999(rem,false);
          return base + " " + numToWords_0_999(rem,false);
        })();

    var uk = (n < 1000)
      ? numToWords_0_999(n, true)
      : (function(){
          var th = Math.floor(n/1000), rem = n%1000;
          var base = numToWords_0_999(th,true) + " thousand";
          if(rem === 0) return base;
          // UK often inserts "and" before numbers under 100 after thousand: "one thousand and five"
          if(rem < 100) return base + " and " + numToWords_0_999(rem,true);
          return base + " " + numToWords_0_999(rem,true);
        })();

    bigCurrent.us = us;
    bigCurrent.uk = uk;

    var correct = (getAccent()==="uk") ? uk : us;
    var distract1 = (getAccent()==="uk") ? us : uk;
    var distract2 = correct.replace(/\band\b/g, "").replace(/\s{2,}/g," ").trim();
    var distract3 = correct.replace(/\bthousand\b/g,"thousand,").replace(",", ""); // slight variation

    var opts = shuffle([correct, distract1, distract2, distract3].filter(function(v,i,a){ return a.indexOf(v)===i; })).slice(0,4);

    var wrap = $("bigOptions");
    wrap.innerHTML = "";
    opts.forEach(function(t){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.innerHTML = "🗣️ " + htmlEscape(t);
      b.addEventListener("click", function(){
        bumpTotal();
        if(t === correct){
          bumpScore();
          setFeedback($("bigFeedback"), "good", "✅ Correct for " + (getAccent()==="uk"?"UK":"US") + ": <strong>" + htmlEscape(correct) + "</strong>");
        }else{
          setFeedback($("bigFeedback"), "bad", "❌ Best for " + (getAccent()==="uk"?"UK":"US") + ": <strong>" + htmlEscape(correct) + "</strong><br><span class='muted'>US often drops “and”; UK often includes it.</span>");
        }
      });
      wrap.appendChild(b);
    });
  }

  function bigSpeak(){
    if(!bigCurrent) return;
    var correct = (getAccent()==="uk") ? bigCurrent.uk : bigCurrent.us;
    speak("Number. " + correct + ".");
  }

  function renderBigChips(){
    var nums = [105, 118, 250, 1005, 1205, 2006, 3210, 9807, 1250, 1409];
    var wrap = $("bigChips");
    wrap.innerHTML = "";
    nums.forEach(function(n){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      b.addEventListener("click", function(){
        var us = (n < 1000) ? numToWords_0_999(n,false) : (numToWords_0_999(Math.floor(n/1000),false) + " thousand " + numToWords_0_999(n%1000,false)).replace(/\s+zero$/,"").trim();
        var uk = (n < 1000) ? numToWords_0_999(n,true) : (numToWords_0_999(Math.floor(n/1000),true) + " thousand " + numToWords_0_999(n%1000,true)).replace(/\s+zero$/,"").trim();
        speak((getAccent()==="uk"?"UK":"US") + ": " + (getAccent()==="uk"?uk:us));
      });
      wrap.appendChild(b);
    });
  }

  /* ---------- 5) Spelling / email / address ---------- */
  function spellChar(c, accent){
    var up = c.toUpperCase();
    if(/[A-Z]/.test(up)){
      if(up === "Z") return (accent==="uk") ? "zed" : "zee";
      return up; // letter name spoken by voice
    }
    if(/[0-9]/.test(c)){
      return digitWord(c);
    }
    var map = {
      "@": "at",
      ".": (accent==="uk") ? "full stop" : "dot",
      "_": "underscore",
      "-": (accent==="uk") ? "hyphen" : "dash",
      "+": "plus",
      "#": "hash",
      "&": "and",
      "/": "slash",
      "\\": "backslash",
      "'": "apostrophe",
      "’": "apostrophe",
      " ": "space"
    };
    return map[c] || c;
  }

  function spellOut(text, accent){
    var chars = String(text || "");
    var parts = [];
    for(var i=0;i<chars.length;i++){
      parts.push(spellChar(chars[i], accent));
    }
    return parts.join(" ");
  }

  function generateSpokenPack(){
    var name = $("spellName").value.trim();
    var email = $("spellEmail").value.trim();
    var street = $("spellStreet").value.trim();
    var city = $("spellCity").value.trim();
    var region = $("spellRegion").value.trim();
    var zip = $("spellZip").value.trim();

    var accent = getAccent();
    var accentLabel = (accent==="uk") ? "British (UK)" : "American (US)";

    var lines = [];
    lines.push("Accent: " + accentLabel);
    lines.push("");

    if(name){
      lines.push("Name (spelled):");
      lines.push(spellOut(name, accent));
      lines.push("");
    }
    if(email){
      lines.push("Email (spelled):");
      lines.push(spellOut(email, accent));
      lines.push("");
    }
    if(street || city || region || zip){
      lines.push("Address (spoken):");
      var zipLabel = (accent==="uk") ? "postcode" : "zip code";
      var addr = [];
      if(street) addr.push(street);
      if(city) addr.push(city);
      if(region) addr.push(region);
      if(zip) addr.push(zipLabel + " " + zip);
      lines.push(addr.join(", "));
      lines.push("");
      lines.push("Address (spelled key parts):");
      var keys = [street, city, region, zip].filter(Boolean).join(" | ");
      if(keys) lines.push(spellOut(keys, accent));
      lines.push("");
    }

    if(!lines.join("").trim()){
      return "Fill the fields above, then click Generate.";
    }
    return lines.join("\n");
  }

  function spellGenerate(){
    var out = generateSpokenPack();
    $("spellOutput").textContent = out;
    setFeedback($("spellFeedback"), "", "Generated. Click <strong>Speak it</strong> to listen.");
  }

  function spellSpeak(){
    var txt = $("spellOutput").textContent || "";
    if(!txt.trim()) return;
    speak(txt.replace(/\n+/g, ". "));
  }

  function spellCopy(){
    var txt = $("spellOutput").textContent || "";
    try{
      navigator.clipboard.writeText(txt);
      setFeedback($("spellFeedback"), "good", "✅ Copied to clipboard.");
    }catch(e){
      setFeedback($("spellFeedback"), "bad", "❌ Couldn’t copy (browser blocked it). You can select + copy manually.");
    }
  }

  /* Listening quiz: choose correct email */
  var emailCorrect = "";
  var emailOptions = [];

  function randomEmail(){
    var names = ["tisha","marie","alex","sam","julien","chloe","victorine","fabrice","anais","myriam"];
    var domains = ["gmail.com","outlook.com","hotmail.com","proton.me","yahoo.com"];
    var n = names[Math.floor(Math.random()*names.length)];
    var num = (Math.random()<0.55) ? String(Math.floor(Math.random()*90)+10) : "";
    var joiner = (Math.random()<0.45) ? "." : (Math.random()<0.5 ? "_" : "");
    var local = n + joiner + (Math.random()<0.5 ? "kaye" : "english") + num;
    var dom = domains[Math.floor(Math.random()*domains.length)];
    return local + "@" + dom;
  }

  function emailNew(){
    emailCorrect = randomEmail();
    // generate options with small confusions: dot vs underscore, z/zee not shown visually but heard, etc.
    var opts = [emailCorrect];
    while(opts.length < 4){
      var e = randomEmail();
      if(opts.indexOf(e)===-1) opts.push(e);
    }
    emailOptions = shuffle(opts);

    $("emailPrompt").textContent = "Listen and choose";
    setFeedback($("emailFeedback"), "", "Click <strong>Listen</strong>, then choose the correct email.");

    var wrap = $("emailOptions");
    wrap.innerHTML = "";
    emailOptions.forEach(function(e){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.innerHTML = "✉️ <strong>" + htmlEscape(e) + "</strong>";
      b.addEventListener("click", function(){
        bumpTotal();
        if(e === emailCorrect){
          bumpScore();
          $("emailPrompt").textContent = emailCorrect;
          setFeedback($("emailFeedback"), "good", "✅ Correct!");
        }else{
          $("emailPrompt").textContent = emailCorrect;
          setFeedback($("emailFeedback"), "bad", "❌ Not that one. Correct email: <strong>" + htmlEscape(emailCorrect) + "</strong>");
        }
      });
      wrap.appendChild(b);
    });
  }

  function emailSpeak(){
    if(!emailCorrect) return;
    var accent = getAccent();
    speak("Email. " + spellOut(emailCorrect, accent) + ".");
  }

  function renderSymbolChips(){
    var sym = [
      ["@", "at"],
      [".", "dot (US) / full stop (UK)"],
      ["_", "underscore"],
      ["-", "dash (US) / hyphen (UK)"],
      ["+", "plus"],
      ["#", "hash"],
      ["/", "slash"],
      ["'", "apostrophe"]
    ];
    var wrap = $("symbolChips");
    wrap.innerHTML = "";
    sym.forEach(function(p){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = p[0] + "  " + p[1];
      b.addEventListener("click", function(){
        var accent = getAccent();
        speak(p[0] + " is said " + (p[0]==="." ? (accent==="uk"?"full stop":"dot") : p[1].split(" / ")[0]) + ".");
      });
      wrap.appendChild(b);
    });
  }

  /* Alphabet flashcards */
  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  function renderAlphaGrid(){
    var wrap = $("alphaGrid");
    wrap.innerHTML = "";
    alpha.forEach(function(letter){
      var card = document.createElement("button");
      card.type = "button";
      card.className = "flash";
      var back = "";
      if(letter === "Z"){
        back = "US: <strong>zee</strong><br>UK: <strong>zed</strong><div class='tag'>Try: “Zebra”</div>";
      }else{
        back = "Tap Listen to hear<br><div class='tag'>Example: " + (letter==="A"?"Apple":letter==="E"?"Email":letter==="I"?"India":letter==="O"?"Oscar":letter==="U"?"Uniform":"") + "</div>";
      }
      card.innerHTML = "<div class='front'>" + letter + "</div><div class='back'>" + back + "</div>";
      card.addEventListener("click", function(){
        card.classList.toggle("is-flipped");
      });
      // long-press alternative not needed; keep simple
      card.addEventListener("dblclick", function(){
        speak(letter === "Z" ? (getAccent()==="uk"?"zed":"zee") : letter);
      });
      wrap.appendChild(card);
    });
  }

  function alphaShuffle(){
    alpha = shuffle(alpha);
    renderAlphaGrid();
  }

  function alphaListen(){
    var letter = alpha[Math.floor(Math.random()*alpha.length)];
    speak(letter === "Z" ? (getAccent()==="uk"?"zed":"zee") : letter);
  }

  /* ---------- 6) Money handling ---------- */
  var moneyTargetCents = 0;
  var moneyTotalCents = 0;
  var moneyHistory = [];
  var currency = "usd";

  var MONEY = {
    usd: {
      symbol: "$",
      coins: [
        {name:"penny", value:1, label:"1¢"},
        {name:"nickel", value:5, label:"5¢"},
        {name:"dime", value:10, label:"10¢"},
        {name:"quarter", value:25, label:"25¢"},
        {name:"half-dollar", value:50, label:"50¢"},
        {name:"dollar coin", value:100, label:"$1"}
      ],
      vocab: ["penny (1 cent)", "nickel (5 cents)", "dime (10 cents)", "quarter (25 cents)", "bill (note)", "change"]
    },
    gbp: {
      symbol: "£",
      coins: [
        {name:"one penny", value:1, label:"1p"},
        {name:"two pence", value:2, label:"2p"},
        {name:"five pence", value:5, label:"5p"},
        {name:"ten pence", value:10, label:"10p"},
        {name:"twenty pence", value:20, label:"20p"},
        {name:"fifty pence", value:50, label:"50p"},
        {name:"one pound", value:100, label:"£1"},
        {name:"two pounds", value:200, label:"£2"}
      ],
      vocab: ["pence (p)", "pound (£)", "coins", "note", "change", "cash"]
    }
  };

  function centsToMoney(c, cur){
    cur = cur || currency;
    var sym = MONEY[cur].symbol;
    if(cur === "usd"){
      var dollars = Math.floor(c/100);
      var cents = c%100;
      return sym + dollars + "." + String(cents).padStart(2,"0");
    }else{
      // GBP: show £ for >= 100, otherwise p
      if(c < 100) return c + "p";
      var pounds = Math.floor(c/100);
      var p = c%100;
      return sym + pounds + "." + String(p).padStart(2,"0");
    }
  }

  function sayMoney(c, cur){
    cur = cur || currency;
    if(cur==="usd"){
      var d = Math.floor(c/100);
      var r = c%100;
      if(r===0) return d + " dollars";
      if(d===0) return r + " cents";
      // common spoken: “three seventy-five”
      return d + " " + String(r).padStart(2,"0");
    }else{
      var pounds = Math.floor(c/100);
      var p = c%100;
      if(pounds===0) return p + " pence";
      if(p===0) return pounds + " pounds";
      return pounds + " pounds " + p + " pence";
    }
  }

  function renderMoneyVocab(){
    var wrap = $("moneyVocab");
    wrap.innerHTML = "";
    MONEY[currency].vocab.forEach(function(v){
      var b = document.createElement("button");
      b.type="button";
      b.className="chip";
      b.textContent=v;
      b.addEventListener("click", function(){ speak(v); });
      wrap.appendChild(b);
    });
  }

  function renderCoinBank(){
    var wrap = $("coinBank");
    wrap.innerHTML = "";
    MONEY[currency].coins.forEach(function(cn){
      var b = document.createElement("button");
      b.type="button";
      b.className="coinbtn";
      b.innerHTML = cn.label + "<small>" + htmlEscape(cn.name) + "</small>";
      b.addEventListener("click", function(){
        moneyTotalCents += cn.value;
        moneyHistory.push(cn.value);
        updateMoneyUI();
      });
      wrap.appendChild(b);
    });
  }

  function updateMoneyUI(){
    $("moneyTarget").textContent = centsToMoney(moneyTargetCents, currency);
    $("moneyTotal").textContent = centsToMoney(moneyTotalCents, currency);
  }

  function moneyNew(){
    currency = $("currency").value;
    moneyHistory = [];
    moneyTotalCents = 0;

    // targets: coins-only reasonable amounts
    if(currency==="usd"){
      // between $0.30 and $4.75
      moneyTargetCents = (30 + Math.floor(Math.random()*446));
    }else{
      // between 12p and £4.20
      moneyTargetCents = (12 + Math.floor(Math.random()*409));
    }

    renderCoinBank();
    renderMoneyVocab();
    updateMoneyUI();
    setFeedback($("moneyFeedback"), "", "Tap coins to reach the target amount.");
  }

  function moneySpeak(){
    speak("Target amount. " + sayMoney(moneyTargetCents, currency) + ".");
  }

  function moneyUndo(){
    if(!moneyHistory.length) return;
    var last = moneyHistory.pop();
    moneyTotalCents = Math.max(0, moneyTotalCents - last);
    updateMoneyUI();
  }

  function moneyClear(){
    moneyHistory = [];
    moneyTotalCents = 0;
    updateMoneyUI();
    setFeedback($("moneyFeedback"), "", "Cleared. Start building again.");
  }

  function moneyCheck(){
    bumpTotal();
    if(moneyTotalCents === moneyTargetCents){
      bumpScore();
      setFeedback($("moneyFeedback"), "good", "✅ Perfect! You built <strong>" + htmlEscape(centsToMoney(moneyTotalCents, currency)) + "</strong>.");
    }else if(moneyTotalCents < moneyTargetCents){
      setFeedback($("moneyFeedback"), "bad", "❌ Too low. You have <strong>" + htmlEscape(centsToMoney(moneyTotalCents, currency)) + "</strong>. Try adding coins.");
    }else{
      setFeedback($("moneyFeedback"), "bad", "❌ Too high. You have <strong>" + htmlEscape(centsToMoney(moneyTotalCents, currency)) + "</strong>. Use <strong>Undo</strong>.");
    }
  }

  /* ---------- Make change ---------- */
  var chgCur = "usd";
  var chgPriceC = 0;
  var chgCashC = 0;

  function newChangeScenario(){
    chgCur = $("currency").value; // follow same currency selector
    currency = chgCur;

    if(chgCur==="usd"){
      // price: 1.15 to 18.95
      chgPriceC = 115 + Math.floor(Math.random()*1781);
      // cash: round to nearest 1, 5, 10, 20
      var bills = [200, 500, 1000, 2000]; // $2, $5, $10, $20 in cents for simple training
      var pick = bills[Math.floor(Math.random()*bills.length)];
      chgCashC = Math.max(pick, Math.ceil(chgPriceC/100)*100); // ensure >= price
      // sometimes bump cash up
      if(chgCashC <= chgPriceC) chgCashC += 500;
    }else{
      // GBP: price 0.65 to 12.80
      chgPriceC = 65 + Math.floor(Math.random()*1216);
      var cashChoices = [200, 500, 1000, 2000]; // £2, £5, £10, £20
      chgCashC = cashChoices[Math.floor(Math.random()*cashChoices.length)];
      if(chgCashC <= chgPriceC) chgCashC = 2000;
    }

    $("chgPrice").textContent = centsToMoney(chgPriceC, chgCur);
    $("chgCash").textContent = centsToMoney(chgCashC, chgCur);
    $("chgInput").value = "";
    setFeedback($("chgFeedback"), "", "Type the change amount (example: 3.75).");
  }

  function changeSpeak(){
    speak("Price " + sayMoney(chgPriceC, chgCur) + ". Cash given " + sayMoney(chgCashC, chgCur) + ". How much change?");
  }

  function parseMoneyInputToCents(val, cur){
    // accept "3.75" or "375" (assume cents/pence?) — keep simple: use decimal
    val = String(val || "").trim().replace(",",".");
    if(!val) return NaN;

    // if user typed like "375" and no decimal, assume cents/pence for < 500 maybe
    if(/^\d+$/.test(val) && val.length<=2) return parseInt(val,10);
    var num = parseFloat(val);
    if(isNaN(num)) return NaN;
    return Math.round(num*100);
  }

  function changeCheck(){
    bumpTotal();
    var expected = chgCashC - chgPriceC;
    var typedC = parseMoneyInputToCents($("chgInput").value, chgCur);
    if(isNaN(typedC)){
      setFeedback($("chgFeedback"), "bad", "❌ Please type a number like <strong>3.75</strong>.");
      return;
    }
    if(typedC === expected){
      bumpScore();
      setFeedback($("chgFeedback"), "good", "✅ Correct! Change = <strong>" + htmlEscape(centsToMoney(expected, chgCur)) + "</strong>.");
    }else{
      setFeedback($("chgFeedback"), "bad", "❌ Not quite. Expected <strong>" + htmlEscape(centsToMoney(expected, chgCur)) + "</strong>.");
    }
  }

  function changeReveal(){
    var expected = chgCashC - chgPriceC;
    setFeedback($("chgFeedback"), "", "Answer: <strong>" + htmlEscape(centsToMoney(expected, chgCur)) + "</strong>");
  }

  /* ---------- global controls ---------- */
  function testVoice(){
    var accent = getAccent();
    var z = getZeroStyle();
    var sample = (accent==="uk")
      ? "British voice. Z is " + (accent==="uk"?"zed":"zee") + ". Example phone: " + sayDigitsAsWords("02079460958") + ". Zero style: " + z + "."
      : "American voice. Z is " + (accent==="uk"?"zed":"zee") + ". Example phone: " + sayDigitsAsWords("4155550123") + ". Zero style: " + z + ".";
    speak(sample);
  }

  function onAccentOrZeroChange(){
    pickVoice();
    // Refresh questions so “correct” matches current accent
    zeroNewQuestion();
    phoneNew();
    roomNew();
    bigNew();
    emailNew();
    renderAlphaGrid();
    moneyNew();
    newChangeScenario();
  }

  /* ---------- wire up ---------- */
  function bind(){
    // voice controls
    $("rate").addEventListener("input", function(){
      $("rateVal").textContent = (parseFloat($("rate").value)||1).toFixed(2);
    });
    $("testVoice").addEventListener("click", testVoice);
    $("stopVoice").addEventListener("click", stopSpeak);
    $("accent").addEventListener("change", onAccentOrZeroChange);
    $("zeroStyle").addEventListener("change", onAccentOrZeroChange);

    // 1) zero quiz
    $("zeroNew").addEventListener("click", zeroNewQuestion);
    $("zeroSpeak").addEventListener("click", zeroSpeak);

    // 2) phone dictation
    $("phoneNew").addEventListener("click", phoneNew);
    $("phoneSpeak").addEventListener("click", phoneSpeak);
    $("phoneReveal").addEventListener("click", phoneReveal);
    $("phoneCheck").addEventListener("click", phoneCheck);
    $("phoneClear").addEventListener("click", phoneClear);

    // chunking
    $("chunkReset").addEventListener("click", chunkReset);
    $("chunkSpeak").addEventListener("click", chunkSpeak);
    $("chunkCheck").addEventListener("click", chunkCheck);

    // 3) room numbers
    $("roomNew").addEventListener("click", roomNew);
    $("roomSpeak").addEventListener("click", roomSpeak);

    // 4) big numbers
    $("bigNew").addEventListener("click", bigNew);
    $("bigSpeak").addEventListener("click", bigSpeak);

    // 5) spelling tools
    $("spellGenerate").addEventListener("click", spellGenerate);
    $("spellSpeak").addEventListener("click", spellSpeak);
    $("spellCopy").addEventListener("click", spellCopy);

    $("emailNew").addEventListener("click", emailNew);
    $("emailSpeak").addEventListener("click", emailSpeak);

    $("alphaShuffle").addEventListener("click", alphaShuffle);
    $("alphaListen").addEventListener("click", alphaListen);

    // 6) money
    $("currency").addEventListener("change", function(){
      moneyNew();
      newChangeScenario();
    });
    $("moneyNew").addEventListener("click", moneyNew);
    $("moneySpeak").addEventListener("click", moneySpeak);
    $("moneyUndo").addEventListener("click", moneyUndo);
    $("moneyClear").addEventListener("click", moneyClear);
    $("moneyCheck").addEventListener("click", moneyCheck);

    // change
    $("chgNew").addEventListener("click", newChangeScenario);
    $("chgSpeak").addEventListener("click", changeSpeak);
    $("chgCheck").addEventListener("click", changeCheck);
    $("chgReveal").addEventListener("click", changeReveal);

    // allow Enter to check in some inputs
    $("phoneInput").addEventListener("keydown", function(e){
      if(e.key === "Enter"){ e.preventDefault(); phoneCheck(); }
    });
    $("chgInput").addEventListener("keydown", function(e){
      if(e.key === "Enter"){ e.preventDefault(); changeCheck(); }
    });
  }

  function boot(){
    initVoices();
    bind();

    // default UI values
    $("rateVal").textContent = (parseFloat($("rate").value)||1).toFixed(2);

    renderZeroChips();
    renderRoomPhrases();
    renderBigChips();
    renderSymbolChips();
    renderAlphaGrid();

    // start content
    zeroNewQuestion();
    phoneNew();
    roomNew();
    bigNew();
    emailNew();
    moneyNew();
    newChangeScenario();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }

})();
