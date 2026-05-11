(function(){
  "use strict";

  const $ = (id)=>document.getElementById(id);
  const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
  const esc = (s)=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let score = 0;
  let accent = "US";
  let voices = [], voiceUS=null, voiceUK=null;
  let currentTab = "attractions";

  const vocabData = {
    attractions: [
      {icon:"🚪", term:"entrance", fr:"entrée", def:"the place where guests go in", ex:"The entrance is on the left."},
      {icon:"⬅️", term:"exit", fr:"sortie", def:"the place where guests leave", ex:"Please use the exit."},
      {icon:"👥", term:"queue", fr:"file d’attente", def:"a line of people waiting", ex:"The queue is very long today."},
      {icon:"⏱️", term:"wait time", fr:"temps d’attente", def:"the time before entering", ex:"The wait time is twenty minutes."},
      {icon:"🎢", term:"ride", fr:"attraction / manège", def:"a Disney attraction", ex:"This ride is very popular."},
      {icon:"🗺️", term:"map", fr:"plan", def:"a guide of the park", ex:"Here is a map of Disneyland."},
      {icon:"💺", term:"seat", fr:"siège", def:"where guests sit", ex:"Please stay in your seat."},
      {icon:"🔒", term:"safety bar", fr:"barre de sécurité", def:"a protection bar on a ride", ex:"Pull down the safety bar."}
    ],
    boutique: [
      {icon:"🧾", term:"receipt", fr:"ticket de caisse", def:"proof of payment", ex:"Here is your receipt."},
      {icon:"💳", term:"cashier", fr:"caissier / caissière", def:"the person at the register", ex:"The cashier can help you."},
      {icon:"🔁", term:"exchange", fr:"échange", def:"changing a product for another one", ex:"We can do an exchange."},
      {icon:"🧑‍🛍️", term:"customer", fr:"client", def:"a person buying something", ex:"I like helping customers."},
      {icon:"👕", term:"size", fr:"taille", def:"clothing measurement", ex:"What size do you need?"},
      {icon:"💶", term:"payment", fr:"paiement", def:"giving money for something", ex:"Payment is here."},
      {icon:"🛍️", term:"bag", fr:"sac", def:"something to carry items", ex:"Would you like a bag?"},
      {icon:"🏷️", term:"price", fr:"prix", def:"the cost of something", ex:"The price is fifteen euros."}
    ],
    service: [
      {icon:"🤝", term:"help", fr:"aider", def:"to give assistance", ex:"I can help you."},
      {icon:"😊", term:"guest", fr:"visiteur", def:"a visitor in the park", ex:"I love helping guests."},
      {icon:"ℹ️", term:"information", fr:"information", def:"useful facts or details", ex:"Here is the information."},
      {icon:"⚠️", term:"problem", fr:"problème", def:"something difficult", ex:"I understand the problem."},
      {icon:"✨", term:"solution", fr:"solution", def:"a way to fix a problem", ex:"Let me find a solution."},
      {icon:"🧑‍💼", term:"manager", fr:"responsable", def:"the person responsible for the team", ex:"I will call the manager."}
    ]
  };

  const preps = [
    ["next to","à côté de","The boutique is next to the castle."],
    ["behind","derrière","The attraction is behind the restaurant."],
    ["in front of","devant","The queue is in front of the entrance."],
    ["near","près de","There is a shop near the castle."],
    ["between","entre","The exit is between the shops."],
    ["on the left","à gauche","The entrance is on the left."],
    ["on the right","à droite","The boutique is on the right."]
  ];

  const roleData = {
    directions: {
      prompt:"Guest: Excuse me, where is the entrance?",
      choices:["The entrance is next to the castle.","Go straight.","It is on the left.","I can show you on the map.","Have a magical day!"],
      model:"The entrance is next to the castle. Go straight, and it is on the left. I can show you on the map."
    },
    boutique: {
      prompt:"Customer: Do you have this in another size?",
      choices:["Of course.","What size do you need?","Let me check for you.","We have this in medium.","Would you like to try it?"],
      model:"Of course. What size do you need? Let me check for you. We have this in medium."
    },
    info: {
      prompt:"Guest: Is there a restaurant near the castle?",
      choices:["Yes, there is.","There is a restaurant near the castle.","There are also two shops nearby.","The restaurant is on the right."],
      model:"Yes, there is. There is a restaurant near the castle, and there are also two shops nearby."
    },
    ticket: {
      prompt:"Guest: I lost my ticket.",
      choices:["Don’t worry.","I can help you.","Let me check with my manager.","Do you have your receipt?","We will find a solution."],
      model:"Don’t worry. I can help you. Do you have your receipt? Let me check with my manager. We will find a solution."
    }
  };

  function updateScore(n){ score += n; if(score<0) score=0; $("score").textContent=score; }
  function shuffle(a){ const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]];} return b; }
  function norm(s){ return String(s).toLowerCase().trim().replace(/[?.!,]/g,"").replace(/\s+/g," "); }

  function pickVoices(){
    if(!("speechSynthesis" in window)) return;
    voices = speechSynthesis.getVoices();
    voiceUS = voices.find(v=>v.lang && v.lang.startsWith("en-US")) || voices.find(v=>v.lang && v.lang.startsWith("en"));
    voiceUK = voices.find(v=>v.lang && v.lang.startsWith("en-GB")) || voices.find(v=>v.lang && v.lang.startsWith("en"));
  }
  function speak(text){
    if(!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g," ").trim());
    const v = accent==="UK" ? voiceUK : voiceUS;
    if(v) u.voice = v;
    u.lang = accent==="UK" ? "en-GB" : "en-US";
    u.rate = .92;
    speechSynthesis.speak(u);
  }
  function setAccent(next){
    accent=next;
    $("accentUS").classList.toggle("active", next==="US");
    $("accentUK").classList.toggle("active", next==="UK");
  }

  function renderVocab(items=vocabData[currentTab]){
    const host=$("vocabGrid");
    host.innerHTML="";
    items.forEach(item=>{
      const card=document.createElement("article");
      card.className="vocabCard";
      card.innerHTML=`
        <div class="vocabTop">
          <div>
            <div class="icon">${item.icon}</div>
            <div class="term">${esc(item.term)}</div>
            <div class="fr hidden">FR: ${esc(item.fr)}</div>
          </div>
          <button class="btn small listen" type="button">🔊</button>
        </div>
        <div class="def hidden"><strong>Definition:</strong> ${esc(item.def)}</div>
        <div class="ex hidden"><strong>Example:</strong> ${esc(item.ex)}</div>`;
      card.addEventListener("click", e=>{
        if(e.target.closest(".listen")) return;
        card.querySelector(".fr").classList.toggle("hidden");
        card.querySelector(".def").classList.toggle("hidden");
        card.querySelector(".ex").classList.toggle("hidden");
      });
      card.querySelector(".listen").addEventListener("click", e=>{ e.stopPropagation(); speak(item.term + ". " + item.ex); updateScore(1); });
      host.appendChild(card);
    });
  }

  function renderQuiz(hostId, data){
    const host=$(hostId); host.innerHTML="";
    data.forEach(q=>{
      const row=document.createElement("div");
      row.className="quizItem";
      row.innerHTML=`<strong>${esc(q.prompt)}</strong><div class="choices"></div><div class="feedback"></div>`;
      const choices=row.querySelector(".choices");
      q.choices.forEach(ch=>{
        const b=document.createElement("button");
        b.className="choice"; b.type="button"; b.textContent=ch;
        b.addEventListener("click",()=>{
          const good = ch===q.answer;
          b.classList.add(good?"good":"bad");
          row.querySelector(".feedback").className="feedback " + (good?"good":"bad");
          row.querySelector(".feedback").textContent = good ? "✅ Great! This is correct." : "💡 Try again. Look at the rule above.";
          if(good && !row.dataset.done){row.dataset.done="1"; updateScore(2);}
        });
        choices.appendChild(b);
      });
      host.appendChild(row);
    });
  }

  function renderInputs(hostId, data){
    const host=$(hostId); host.innerHTML="";
    data.forEach(q=>{
      const row=document.createElement("div");
      row.className="inputItem";
      row.innerHTML=`<strong>${esc(q.prompt)}</strong><div class="inputRow"><input placeholder="Type your answer..."><button class="btn" type="button">Check</button></div><div class="feedback"></div>`;
      const input=row.querySelector("input");
      row.querySelector("button").addEventListener("click",()=>{
        const val=norm(input.value);
        const ok=q.answers.some(a=>norm(a)===val || val.includes(norm(a)));
        row.querySelector(".feedback").className="feedback " + (ok?"good":"bad");
        row.querySelector(".feedback").textContent= ok ? "✅ Excellent!" : "💡 Hint: " + q.hint;
        if(ok && !row.dataset.done){row.dataset.done="1"; updateScore(2);}
      });
      host.appendChild(row);
    });
  }

  function renderBuilder(hostId, target, words){
    const host=$(hostId);
    host.innerHTML=`<div class="wordBank"></div><div class="answerBank"></div><div class="toolRow"><button class="btn check" type="button">Check</button><button class="btn ghost clear" type="button">Clear</button><button class="btn listen" type="button">🔊 Listen</button></div><div class="feedback"></div>`;
    const bank=host.querySelector(".wordBank"), answer=host.querySelector(".answerBank");
    shuffle(words).forEach(w=>{
      const b=document.createElement("button");
      b.className="word"; b.type="button"; b.textContent=w;
      b.addEventListener("click",()=>{ answer.appendChild(b); });
      bank.appendChild(b);
    });
    host.querySelector(".clear").addEventListener("click",()=>renderBuilder(hostId,target,words));
    host.querySelector(".listen").addEventListener("click",()=>speak($$(".word", answer).map(x=>x.textContent).join(" ")));
    host.querySelector(".check").addEventListener("click",()=>{
      const made=$$(".word", answer).map(x=>x.textContent).join(" ");
      const ok=norm(made)===norm(target);
      const fb=host.querySelector(".feedback");
      fb.className="feedback " + (ok?"good":"bad");
      fb.textContent= ok ? "✅ Perfect sentence!" : "💡 Target: " + target;
      if(ok && !host.dataset.done){host.dataset.done="1"; updateScore(3);}
    });
  }

  function renderPreps(){
    const host=$("prepGrid"); host.innerHTML="";
    preps.forEach(p=>{
      const card=document.createElement("button");
      card.className="prepCard"; card.type="button";
      card.innerHTML=`<strong>${esc(p[0])}</strong><br><span class="fr">${esc(p[1])}</span><p>${esc(p[2])}</p>`;
      card.addEventListener("click",()=>{speak(p[0]+". "+p[2]); updateScore(1);});
      host.appendChild(card);
    });
  }

  function renderRole(){
    const s=$("roleScenario").value;
    const data=roleData[s];
    $("rolePrompt").textContent=data.prompt;
    const host=$("roleChoices"); host.innerHTML="";
    data.choices.forEach(ch=>{
      const c=document.createElement("div"); c.className="choiceCard"; c.textContent=ch;
      c.addEventListener("click",()=>c.classList.toggle("selected"));
      host.appendChild(c);
    });
    $("roleOutput").textContent="";
  }

  function init(){
    pickVoices();
    if("speechSynthesis" in window){ speechSynthesis.onvoiceschanged=pickVoices; }

    $("accentUS").addEventListener("click",()=>setAccent("US"));
    $("accentUK").addEventListener("click",()=>setAccent("UK"));
    $("resetAll").addEventListener("click",()=>{score=0; $("score").textContent="0"; location.reload();});
    $$("[data-speak]").forEach(btn=>btn.addEventListener("click",()=>{ const el=document.querySelector(btn.getAttribute("data-speak")); speak(el ? el.textContent : ""); updateScore(1); }));
    $$("[data-scroll]").forEach(btn=>btn.addEventListener("click",()=>document.querySelector(btn.getAttribute("data-scroll")).scrollIntoView({behavior:"smooth"})));

    $$(".tab").forEach(btn=>{
      btn.addEventListener("click",()=>{
        $$(".tab").forEach(x=>x.classList.remove("active"));
        btn.classList.add("active");
        currentTab=btn.dataset.tab;
        renderVocab(vocabData[currentTab]);
      });
    });
    renderVocab();
    $("shuffleVocab").addEventListener("click",()=>renderVocab(shuffle(vocabData[currentTab])));
    $("listenVocab").addEventListener("click",()=>speak(vocabData[currentTab].map(v=>v.term+". "+v.ex).join(" ")));

    renderQuiz("verbSort", [
      {prompt:"help", choices:["action verb","state verb"], answer:"action verb"},
      {prompt:"love", choices:["action verb","state verb"], answer:"state verb"},
      {prompt:"wait", choices:["action verb","state verb"], answer:"action verb"},
      {prompt:"need", choices:["action verb","state verb"], answer:"state verb"}
    ]);

    renderQuiz("presentSimpleQuiz", [
      {prompt:"She ___ guests.", choices:["help","helps","helping"], answer:"helps"},
      {prompt:"I ___ in a boutique.", choices:["work","works","am work"], answer:"work"},
      {prompt:"The attraction ___ at 9.", choices:["open","opens","is open"], answer:"opens"},
      {prompt:"Do you ___ here?", choices:["work","works","working"], answer:"work"}
    ]);
    renderInputs("simpleRewrite", [
      {prompt:"Make it correct: I sale strawberries.", answers:["I sell strawberries"], hint:"Use the verb SELL, not sale."},
      {prompt:"Make it correct: He work in the shop.", answers:["He works in the shop"], hint:"He / she / it + verb + s."},
      {prompt:"Make it correct: I have 21 years old.", answers:["I am 21 years old"], hint:"Age uses BE: I am 21 years old."}
    ]);

    renderQuiz("continuousQuiz", [
      {prompt:"Right now, I ___ a guest.", choices:["help","am helping","helps"], answer:"am helping"},
      {prompt:"Guests ___ outside at the moment.", choices:["wait","are waiting","waits"], answer:"are waiting"},
      {prompt:"She ___ in the boutique today.", choices:["works","is working","work"], answer:"is working"}
    ]);

    renderQuiz("tenseChoice", [
      {prompt:"Every day, I ___ guests.", choices:["help","am helping"], answer:"help"},
      {prompt:"Right now, I ___ a customer.", choices:["help","am helping"], answer:"am helping"},
      {prompt:"Usually, the attraction ___ at 10.", choices:["opens","is opening"], answer:"opens"},
      {prompt:"Today, we ___ a special event.", choices:["prepare","are preparing"], answer:"are preparing"}
    ]);

    renderQuiz("articleQuiz", [
      {prompt:"___ castle is on the left.", choices:["A","An","The","Ø"], answer:"The"},
      {prompt:"Would you like ___ bag?", choices:["a","an","the","Ø"], answer:"a"},
      {prompt:"This is ___ attraction.", choices:["a","an","the","Ø"], answer:"an"},
      {prompt:"I need ___ English for work.", choices:["a","an","the","Ø"], answer:"Ø"},
      {prompt:"I study ___ literature.", choices:["a","an","the","Ø"], answer:"Ø"}
    ]);
    renderInputs("articleInputs", [
      {prompt:"Type the missing article: Would you like ___ map?", answers:["a"], hint:"One non-specific thing = a map."},
      {prompt:"Type the missing article: Where is ___ exit?", answers:["the"], hint:"Specific place = the exit."},
      {prompt:"Type the missing article: I love ___ Disney.", answers:["nothing","Ø","no article"], hint:"General proper name here = no article."},
      {prompt:"Type the missing article: This is ___ entrance.", answers:["an"], hint:"Entrance starts with a vowel sound = an."}
    ]);

    renderQuiz("thereQuiz", [
      {prompt:"___ a shop near the castle.", choices:["There is","There are"], answer:"There is"},
      {prompt:"___ two entrances.", choices:["There is","There are"], answer:"There are"},
      {prompt:"___ a queue outside.", choices:["There is","There are"], answer:"There is"},
      {prompt:"___ many guests today.", choices:["There is","There are"], answer:"There are"}
    ]);
    renderBuilder("thereBuilder","There is a shop near the castle.",["There","is","a","shop","near","the","castle."]);

    renderPreps();
    renderQuiz("prepQuiz", [
      {prompt:"The boutique is ___ the castle.", choices:["next to","between","under"], answer:"next to"},
      {prompt:"The attraction is ___ the restaurant.", choices:["behind","every day","an"], answer:"behind"},
      {prompt:"The entrance is ___ the left.", choices:["on","in","at"], answer:"on"}
    ]);
    renderBuilder("directionBuilder","The entrance is on the left.",["The","entrance","is","on","the","left."]);

    $("checkAttractionDialogue").addEventListener("click",()=>{
      const ok=$("attr1").value.startsWith("The entrance") && $("attr2").value.startsWith("The wait time");
      $("attrFeedback").className="feedback "+(ok?"good":"bad");
      $("attrFeedback").textContent=ok?"✅ Beautiful attraction dialogue.":"💡 Choose the clear, professional answers.";
      if(ok){updateScore(5); speak($("attrModel").textContent);}
    });
    $("checkShopDialogue").addEventListener("click",()=>{
      const ok=$("shop1").value.startsWith("Of course") && $("shop2").value.startsWith("Let me");
      $("shopFeedback").className="feedback "+(ok?"good":"bad");
      $("shopFeedback").textContent=ok?"✅ Excellent boutique dialogue.":"💡 Choose the polite customer-service answers.";
      if(ok){updateScore(5); speak($("shopModel").textContent);}
    });

    $("roleScenario").addEventListener("change",renderRole);
    renderRole();
    $("buildRole").addEventListener("click",()=>{
      const chosen=$$(".choiceCard.selected", $("roleChoices")).map(x=>x.textContent);
      const s=$("roleScenario").value;
      $("roleOutput").innerHTML="<strong>Your response:</strong><br>"+esc(chosen.join(" "))+"<hr><strong>Model answer:</strong><br>"+esc(roleData[s].model);
      if(chosen.length>=3) updateScore(3);
    });
    $("speakRole").addEventListener("click",()=>speak($("roleOutput").textContent || roleData[$("roleScenario").value].model));
    $("resetRole").addEventListener("click",renderRole);

    $("checkInterview").addEventListener("click",()=>{
      const t=$("interviewAnswer").value;
      let pts=0, tips=[];
      if(/\bcan\b/i.test(t)) pts++; else tips.push("Add CAN: I can help guests.");
      if(/\bwould\b/i.test(t)) pts++; else tips.push("Add WOULD: I would listen carefully.");
      if(/\bthere is\b|\bthere are\b/i.test(t)) pts++; else tips.push("Add THERE IS / THERE ARE to describe the park.");
      if(/\ba\b|\ban\b|\bthe\b/i.test(t)) pts++; else tips.push("Try to use a/an/the correctly.");
      if(/\bguest|customer|boutique|attraction|ride|shop\b/i.test(t)) pts++; else tips.push("Add Disney job vocabulary.");
      $("interviewFeedback").className="feedback "+(pts>=4?"good":"bad");
      $("interviewFeedback").innerHTML=pts>=4 ? "✅ Strong answer! You sound more confident and professional." : "💡 Good start. " + tips.join(" ");
      updateScore(pts);
    });
    $("speakInterview").addEventListener("click",()=>speak($("interviewAnswer").value));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
