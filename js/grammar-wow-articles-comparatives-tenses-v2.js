/* SpeakEasyTisha — Grammar WOW!
   Goals: instant feedback, tap-friendly, iPad Safari compatible, teacher mode hints. */
(function(){
  'use strict';

  // ---------- tiny helpers ----------
  var $ = function(sel, root){ return (root||document).querySelector(sel); };
  var $$ = function(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); };
  var norm = function(s){ return (s||'').toString().trim().toLowerCase().replace(/\s+/g,' '); };
  var hasSpeech = function(){ return ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window); };

  // ---------- level + shuffle ----------
  var currentLevel = 'A2';
  function shuffle(arr){
    for(var i=arr.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t = arr[i]; arr[i]=arr[j]; arr[j]=t;
    }
    return arr;
  }
  function isActive(el){
    if(!el) return true;
    var block = el.closest ? el.closest('.levelBlock[data-level]') : null;
    if(!block) return true;
    return (block.getAttribute('data-level') === currentLevel);
  }
  function applyLevel(level){
    currentLevel = level || currentLevel || 'A2';
    var now = document.getElementById('levelNow');
    if(now) now.textContent = currentLevel;
    // toggle blocks
    $$('.levelBlock[data-level]').forEach(function(b){
      var lvl = b.getAttribute('data-level');
      if(!lvl) return;
      if(lvl === currentLevel){ b.classList.remove('is-hidden'); }
      else{ b.classList.add('is-hidden'); }
    });
    // update expectations text
    var exp = document.getElementById('expectText');
    if(exp){
      exp.textContent = (currentLevel==='B2')
        ? 'B2: 8 sentences + connectors + advanced tense. Aim for natural flow + precision.'
        : 'A2: 6 key sentences. Aim for accuracy + confidence.';
    }
    // update score maximum for the visible level
    setScoreMax();
    // reset to avoid mixing levels
    resetAll();
    // refresh level-dependent mini-games
    newTapOrder();
  }


  // ---------- score system ----------
  var score=0, maxScore=0, streak=0;
  var scoreNow = $('#scoreNow');
  var scoreMax = $('#scoreMax');
  var streakNow = $('#streakNow');
  var modeNow = $('#modeNow');

  // Track per-item correctness to avoid double scoring
  var scored = new WeakMap(); // element -> boolean correct already?

  function setScoreMax(){
    // count only items from the active level
    var mcqItems = $$('[data-type="mcq"]').filter(isActive);
    var qcmItems = $$('[data-qcm] .qcm__item').filter(isActive);
    var awards = $$('[data-awards] .award').filter(isActive);
    var gapInputs = $$('[data-gap-answer]').filter(isActive);
    var tenseItems = $$('[data-tense] .tensequiz__item').filter(isActive);
    var dialogueSteps = $$('[data-dialogue] .dialogue__choices').filter(isActive);
    var missionInputs = $$('[data-free-answer]').filter(isActive);
    // comparatives builder & tap-order each count as 1
    maxScore = mcqItems.length + qcmItems.length + awards.length + gapInputs.length + tenseItems.length + dialogueSteps.length + missionInputs.length + 2;
    scoreMax.textContent = String(maxScore);
  }

  function bump(correct, itemEl){
    if(correct){
      streak += 1;
      if(itemEl && !scored.get(itemEl)){
        scored.set(itemEl, true);
        score += 1;
      }
    }else{
      streak = 0;
      if(itemEl) scored.set(itemEl, false);
    }
    scoreNow.textContent = String(score);
    streakNow.textContent = String(streak);
  }

  function setFeedback(el, ok, msg){
    if(!el) return;
    el.classList.remove('ok','no');
    el.classList.add(ok ? 'ok' : 'no');
    el.textContent = msg;
  }

  // ---------- teacher mode ----------
  var btnTeacher = $('#btnTeacher');
  function toggleTeacher(force){
    var on = (typeof force !== 'undefined') ? !!force : !document.body.classList.contains('teacher');
    document.body.classList.toggle('teacher', on);
    btnTeacher.setAttribute('aria-pressed', on ? 'true' : 'false');
    modeNow.textContent = on ? 'Teacher' : 'Student';
  }

  // ---------- reset ----------
  function resetAll(){
    score=0; streak=0;
    scored = new WeakMap();
    scoreNow.textContent='0'; streakNow.textContent='0';

    // clear feedback everywhere
    $$('.fb').forEach(function(fb){ fb.classList.remove('ok','no'); fb.textContent=''; });
    // reset pressed state
    $$('.choice[aria-pressed="true"]').forEach(function(btn){ btn.setAttribute('aria-pressed','false'); });
    // reset selects
    $$('select').forEach(function(sel){ if(sel.classList.contains('award__sel')) sel.value=''; });
    // reset gaps/mission
    $$('input[data-gap-answer], input[data-free-answer]').forEach(function(inp){ inp.value=''; });
    // hide dialogue
    var dialogue = $('#dialogue');
    if(dialogue) dialogue.hidden = true;
    $('#dialogueResult').textContent = 'Finish the dialogue to get your stamp ✅';

    // clear tap order
    clearTapOrder();

    // rebuild comparative sentence
    newCompSentence();

    // unlock note
    $('#unlockNote').textContent = 'Complete 4/5 to unlock (or use Teacher Mode).';

    // rebuild script
    updateScript();
  }

  // ---------- printing ----------
  $('#btnPrint').addEventListener('click', function(){ window.print(); });

  // ---------- randomize scroll order ----------
  $('#btnRandomize').addEventListener('click', function(){
    var ids = ['warmup','comparatives','superlatives','articles','tenses','final'];
    var shuffled = ids.slice().sort(function(){ return Math.random()-0.5; });
    var first = document.getElementById(shuffled[0]);
    if(first) first.scrollIntoView({behavior:'smooth', block:'start'});
  });

  // ---------- warmup MCQ handling ----------
  function initMcqGroup(root){
    var items = $$('[data-type="mcq"]', root);
    items.forEach(function(item){
      var ans = item.getAttribute('data-answer');
      var fb = $('.fb', item);
      var choices = $$('.choice', item);
      choices.forEach(function(btn){
        btn.setAttribute('aria-pressed','false');
        btn.addEventListener('click', function(){
          // pressed state
          choices.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
          btn.setAttribute('aria-pressed','true');
          var pick = btn.getAttribute('data-choice');
          var ok = pick === ans;
          setFeedback(fb, ok, ok ? '✅ Correct!' : '❌ Not quite — try again.');
          bump(ok, item);
        });
      });
    });
  }

  // ---------- QCM (articles practice) ----------
  function initQcm(root){
    var items = $$('.qcm__item', root);
    items.forEach(function(item){
      var ans = norm(item.getAttribute('data-answer'));
      var fb = $('.fb', item);
      var choices = $$('.choice', item);
      choices.forEach(function(btn){
        btn.setAttribute('aria-pressed','false');
        btn.addEventListener('click', function(){
          choices.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
          btn.setAttribute('aria-pressed','true');
          var pick = norm(btn.getAttribute('data-choice'));
          var ok = pick === ans;
          setFeedback(fb, ok, ok ? '✅ Correct!' : '❌ Try again.');
          bump(ok, item);
        });
      });
    });
  }

  // ---------- superlative awards selects ----------
  function initAwards(){
    var awards = $$('[data-awards] .award');
    awards.forEach(function(card){
      var ans = norm(card.getAttribute('data-answer'));
      var sel = $('.award__sel', card);
      var fb = $('.fb', card);
      sel.addEventListener('change', function(){
        var pick = norm(sel.value);
        if(!pick){
          fb.textContent=''; fb.classList.remove('ok','no'); return;
        }
        var ok = pick === ans;
        setFeedback(fb, ok, ok ? '✅ Perfect.' : '❌ Almost — check “the” / form.');
        bump(ok, card);
      });
    });
  }

  // ---------- chips + speech ----------
  function initSpeech(){
    var sayText = $('#sayText');
    $$('.chip').forEach(function(btn){
      btn.addEventListener('click', function(){
        sayText.textContent = btn.getAttribute('data-say') || btn.textContent;
      });
    });
    var speakBtn = $('#btnSpeak');
    if(!hasSpeech()){
      speakBtn.disabled = true;
      speakBtn.title = 'Speech not available in this browser.';
      return;
    }
    speakBtn.addEventListener('click', function(){
      var text = (sayText.textContent || '').trim();
      if(!text || text==='—') return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.pitch = 1.0;
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    });
  }

  // ---------- tab system (articles) ----------
  function initTabs(){
    var tabs = $$('.tab');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var target = tab.getAttribute('data-tab');
        tabs.forEach(function(t){
          t.classList.toggle('is-active', t===tab);
          t.setAttribute('aria-selected', t===tab ? 'true' : 'false');
        });
        $$('.tabpane').forEach(function(p){
          p.classList.toggle('is-active', p.getAttribute('data-pane')===target);
        });
      });
    });
  }

  // ---------- gap fill (articles tricky) ----------
  function initGapFill(){
    var inputs = $$('input[data-gap-answer]');
    inputs.forEach(function(inp){
      var wrap = inp.closest('.gap');
      var fb = $('.fb', wrap);
      var ans = norm(inp.getAttribute('data-gap-answer'));
      var evaluate = function(){
        var val = norm(inp.value);
        if(!val){
          fb.textContent=''; fb.classList.remove('ok','no'); return;
        }
        var ok = val === ans;
        setFeedback(fb, ok, ok ? '✅' : '❌');
        bump(ok, wrap);
      };
      inp.addEventListener('input', evaluate);
      inp.addEventListener('blur', evaluate);
    });
  }

  // ---------- Comparatives builder ----------
  var compSentence = $('#compSentence');
  var compFeedback = $('#compFeedback');
  var compHint = $('#compHint');
  var adjPick = $('#adjPick');
  var patternPick = $('#patternPick');
  var contextPick = $('#contextPick');
  var compTarget = null; // normalized comparative form expected
  var compItemEl = null;

  function comparativeForm(adj){
    var a = norm(adj.replace(/\(.*?\)/g,''));
    if(a==='good') return 'better';
    if(a==='bad') return 'worse';
    if(['cheap','fast','tall','small','short','long','old','new'].indexOf(a) >= 0) return a + 'er';
    if(a.slice(-1)==='y') return a.slice(0,-1) + 'ier';
    return 'more ' + a;
  }

  function compContextSentence(comp){
    var ctx = contextPick.value;
    var pool = {
      transport: [
        'The train is ' + comp + ' than the plane for short trips.',
        'This route is ' + comp + ' than the other one.',
        'A direct flight is ' + comp + ' than a flight with a stopover.'
      ],
      housing: [
        'The suburb is ' + comp + ' than the city center.',
        'This apartment is ' + comp + ' than the last one.',
        'Living outside the city is ' + comp + ' for families.'
      ],
      health: [
        'Urgent care is ' + comp + ' than the ER for minor problems.',
        'This clinic is ' + comp + ' than the hospital.',
        'A scheduled visit is ' + comp + ' than a last‑minute visit.'
      ],
      shopping: [
        'Online shopping is ' + comp + ' than going to the store.',
        'This website is ' + comp + ' than the other one.',
        'Buying in bulk is ' + comp + ' for big families.'
      ]
    };
    var arr = pool[ctx] || pool.transport;
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function newCompSentence(){
    var adjLabel = adjPick.value;
    var baseAdj = norm(adjLabel.replace(/\(.*?\)/g,''));
    var auto = comparativeForm(adjLabel);
    var comp = auto;
    var pattern = patternPick.value;

    if(pattern==='-er'){
      if(baseAdj==='good') comp='better';
      else if(baseAdj==='bad') comp='worse';
      else if(baseAdj.slice(-1)==='y') comp=baseAdj.slice(0,-1)+'ier';
      else comp=baseAdj+'er';
    }else if(pattern==='more'){
      comp = 'more '+baseAdj;
    }else if(pattern==='irregular'){
      comp = (baseAdj==='bad') ? 'worse' : 'better';
    }else{
      comp = auto;
    }

    compTarget = norm(comp);
    var sentence = compContextSentence(comp);
    compSentence.textContent = sentence;
    compFeedback.textContent = '';
    compFeedback.classList.remove('ok','no');
    compHint.textContent = '';
    compItemEl = document.getElementById('comparatives'); // score element (one point)
  }

  function checkComp(){
    var chosenAdj = adjPick.value;
    var baseAdj = norm(chosenAdj.replace(/\(.*?\)/g,''));
    var expected = norm(comparativeForm(chosenAdj));

    var ok = (compTarget===expected) ||
              (baseAdj==='good' && compTarget==='better') ||
              (baseAdj==='bad' && compTarget==='worse');

    if(ok){
      setFeedback(compFeedback, true, '✅ Great! Your comparative form matches the adjective rules.');
      compHint.textContent = 'Nice: “' + expected + '” is the correct comparative form.';
    }else{
      setFeedback(compFeedback, false, '❌ Not quite. Try “Auto (smart)” or review the rule card.');
      compHint.textContent = 'For “' + baseAdj + '”, the safest form is: “' + expected + '”.';
    }
    bump(ok, compItemEl);
  }

  $('#btnCompNew').addEventListener('click', newCompSentence);
  $('#btnCompCheck').addEventListener('click', checkComp);
  [adjPick, patternPick, contextPick].forEach(function(el){ el.addEventListener('change', newCompSentence); });

  // ---------- Tap-order challenge ----------
  var bank = $('.taporder__bank');
  var orderLine = $('#orderLine');
  var orderFeedback = $('#orderFeedback');
  var orderHint = $('#orderHint');

  var orderTargetTokens = [];
  var orderBankTokens = [];
  var pickedTokens = [];

  var orderItemsByLevel = {
    A2: [
      { target: ['This','clinic','is','cheaper','than','the','hospital','.'], hint:'Comparative order: subject + be + comparative + than + the + noun.' },
      { target: ['It','was','the','best','day','of','my','life','.'], hint:'Superlatives usually use “the”: the best / the worst…' },
      { target: ['I','have','lived','in','France','for','years','.'], hint:'Present perfect: have/has + past participle.' },
      { target: ['She','is','an','honest','person','.'], hint:'“honest” starts with a vowel sound → an.' }
    ],
    B2: [
      { target: ['Although','urgent','care','is','cheaper',',','it','can','still','be','busy','.'], hint:'Connector + comma: Although … , …' },
      { target: ['By','next','month',',','we','will','have','chosen','a','plan','.'], hint:'Future perfect: By + time, will have + past participle.' },
      { target: ['This','is','the','most','useful','tool','I','have','ever','used','.'], hint:'Superlative + present perfect: the most… / have ever…' },
      { target: ['She','went','to','Ø','school','in','France',',','but','to','the','university','in','the','US','.'], hint:'Ø school (institution), the university (specific). Use “the US”.' },
      { target: ['The','PPO','is','more','flexible','than','the','HMO','.'], hint:'Comparative: more + adjective + than.' },
      { target: ['I','had','already','sent','the','forms','when','HR','called','.'], hint:'Past perfect: had already + past participle.' }
    ]
  };

  function buildTokens(words){
    return words.map(function(t, i){ return { id: i + '_' + t + '_' + Math.random().toString(16).slice(2), text: t }; });
  }

  function renderOrder(){
    if(!bank || !orderLine) return;
    bank.innerHTML = '';
    orderLine.innerHTML = '';

    if(pickedTokens.length===0){
      orderLine.textContent = 'Tap words here…';
    }else{
      pickedTokens.forEach(function(tok, idx){
        var btn = document.createElement('button');
        btn.type='button';
        btn.className='word is-picked';
        btn.textContent = tok.text;
        btn.addEventListener('click', function(){
          pickedTokens.splice(idx, 1);
          orderBankTokens.push(tok);
          renderOrder();
        });
        orderLine.appendChild(btn);
      });
    }

    orderBankTokens.forEach(function(tok){
      var btn = document.createElement('button');
      btn.type='button';
      btn.className='word';
      btn.textContent = tok.text;
      btn.addEventListener('click', function(){
        var idx = orderBankTokens.findIndex(function(x){ return x.id===tok.id; });
        if(idx>-1){
          var t = orderBankTokens.splice(idx,1)[0];
          pickedTokens.push(t);
          renderOrder();
        }
      });
      bank.appendChild(btn);
    });
  }

  function newTapOrder(){
    var pool = orderItemsByLevel[currentLevel] || orderItemsByLevel.A2;
    var item = pool[Math.floor(Math.random()*pool.length)];
    orderHint.textContent = item.hint;
    orderFeedback.textContent = '';
    orderFeedback.classList.remove('ok','no');

    orderTargetTokens = buildTokens(item.target);
    orderBankTokens = shuffle(orderTargetTokens.slice());
    pickedTokens = [];
    renderOrder();
  }

  function clearTapOrder(){
    orderBankTokens = shuffle(orderTargetTokens.slice());
    pickedTokens = [];
    renderOrder();
    orderFeedback.textContent = '';
    orderFeedback.classList.remove('ok','no');
  }

  function checkTapOrder(){
    var ok = (pickedTokens.length === orderTargetTokens.length) && pickedTokens.every(function(tok, i){
      return tok.text === orderTargetTokens[i].text;
    });
    setFeedback(orderFeedback, ok, ok ? '✅ Perfect word order!' : '❌ Not yet — try again (tap a word to remove it).');
    bump(ok, document.getElementById('comparatives')); // second point for tap-order challenge
  }

  $('#btnOrderNew').addEventListener('click', newTapOrder);
  $('#btnOrderReset').addEventListener('click', clearTapOrder);
  $('#btnOrderCheck').addEventListener('click', checkTapOrder);

  // ---------- Tense quiz ----------
  function initTense(){
    var items = $$('[data-tense] .tensequiz__item');
    items.forEach(function(item){
      var ans = norm(item.getAttribute('data-answer'));
      var fb = $('.fb', item);
      var choices = $$('.choice', item);
      choices.forEach(function(btn){
        btn.setAttribute('aria-pressed','false');
        btn.addEventListener('click', function(){
          choices.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
          btn.setAttribute('aria-pressed','true');
          var pick = norm(btn.getAttribute('data-choice'));
          var ok = pick === ans;
          setFeedback(fb, ok, ok ? '✅' : '❌');
          bump(ok, item);
          updateUnlock();
        });
      });
    });
  }

  function countTenseCorrect(){
    var items = $$('[data-tense] .tensequiz__item').filter(isActive);
    return items.reduce(function(acc, item){
      return acc + (scored.get(item)===true ? 1 : 0);
    }, 0);
  }

  function updateUnlock(){
    var items = $$('[data-tense] .tensequiz__item').filter(isActive);
    var total = items.length || 5;
    var needed = Math.max(1, total-1); // e.g., 4/5
    var c = countTenseCorrect();
    var note = $('#unlockNote');
    if(document.body.classList.contains('teacher') || c >= needed){
      note.textContent = 'Unlocked ✅ Scroll down for the dialogue.';
    }else{
      note.textContent = 'Complete ' + needed + '/' + total + ' to unlock (you have ' + c + '/' + total + ').';
    }
  }

  $('#btnUnlockDialogue').addEventListener('click', function(){
    var dialogue = $('#dialogue');
    var c = countTenseCorrect();
    if(document.body.classList.contains('teacher') || c >= 4){
      dialogue.hidden = false;
      dialogue.scrollIntoView({behavior:'smooth', block:'start'});
    }else{
      dialogue.hidden = true;
      alert('Complete at least 4/5 tense questions to unlock (or activate Teacher Mode).');
    }
  });

  // ---------- Dialogue steps ----------
  function initDialogue(){
    var steps = $$('[data-dialogue] .dialogue__choices');
    steps.forEach(function(step){
      var ans = step.getAttribute('data-answer');
      var fb = step.nextElementSibling; // .fb right after
      var choices = $$('.choice', step);
      choices.forEach(function(btn){
        btn.setAttribute('aria-pressed','false');
        btn.addEventListener('click', function(){
          choices.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
          btn.setAttribute('aria-pressed','true');
          var pick = btn.getAttribute('data-choice');
          var ok = pick === ans;
          setFeedback(fb, ok, ok ? '✅' : '❌ Try again.');
          bump(ok, step);
          updateDialogueResult();
        });
      });
    });
  }

  function updateDialogueResult(){
    var steps = $$('[data-dialogue] .dialogue__choices');
    var correct = steps.reduce(function(acc, s){
      return acc + (scored.get(s)===true ? 1 : 0);
    }, 0);
    var out = $('#dialogueResult');
    if(correct === steps.length){
      out.textContent = '🎉 Stamp earned! Your dialogue is smooth, natural, and correct.';
      out.classList.add('ok'); out.classList.remove('no');
    }else{
      out.textContent = 'Progress: ' + correct + '/' + steps.length + ' steps correct.';
      out.classList.remove('ok','no');
    }
  }

  $('#btnDialogueReset').addEventListener('click', function(){
    // clear pressed in dialogue
    $$('[data-dialogue] .dialogue__choices').forEach(function(step){
      $$('.choice', step).forEach(function(b){ b.setAttribute('aria-pressed','false'); });
      var fb = step.nextElementSibling;
      fb.textContent=''; fb.classList.remove('ok','no');
      scored.set(step,false);
    });
    $('#dialogueResult').textContent = 'Finish the dialogue to get your stamp ✅';
  });

  // ---------- Mission (free inputs) ----------
  function initMission(){
    var inputs = $$('input[data-free-answer]');
    inputs.forEach(function(inp){
      var wrap = inp.closest('.mission__item');
      var fb = $('.fb', wrap);
      var ans = norm(inp.getAttribute('data-free-answer'));
      var alt = inp.getAttribute('data-free-alt');
      var altRe = alt ? new RegExp('^(' + alt + ')$', 'i') : null;

      var evaluate = function(){
        if(!isActive(inp)) return;
        var v = norm(inp.value);
        if(!v){
          fb.textContent=''; fb.classList.remove('ok','no'); return;
        }
        var ok = (v === ans) || (altRe && altRe.test(v));
        setFeedback(fb, ok, ok ? '✅' : '❌');
        bump(ok, wrap);
        updateBadge();
        updateScript();
      };

      inp.addEventListener('input', evaluate);
      inp.addEventListener('blur', evaluate);
    });

    function activeInputs(){
      return $$('input[data-free-answer]').filter(isActive);
    }

    $('#btnMissionCheck').addEventListener('click', function(){
      activeInputs().forEach(function(inp){ inp.dispatchEvent(new Event('blur')); });
      var correct = countMissionCorrect();
      var total = activeInputs().length;
      var out = $('#missionResult');
      if(correct === total){
        out.textContent = '🎆 WOW! Perfect mission. Now: read the mini‑script out loud.';
        out.classList.add('ok'); out.classList.remove('no');
      }else{
        out.textContent = 'You have ' + correct + '/' + total + '. Keep going — you’re close.';
        out.classList.remove('ok'); out.classList.add('no');
      }
      updateBadge();
    });

    $('#btnMissionFill').addEventListener('click', function(){
      activeInputs().forEach(function(inp){
        var ans = inp.getAttribute('data-free-answer');
        inp.value = ans;
        inp.dispatchEvent(new Event('blur'));
      });
    });
  }

  function countMissionCorrect(){
    var items = $$('.mission__item').filter(isActive);
    return items.reduce(function(acc, item){
      return acc + (scored.get(item)===true ? 1 : 0);
    }, 0);
  }

  function updateBadge(){
    var correct = countMissionCorrect();
    $('#badgeScore').textContent = String(correct);
  }

  function getInputVal(label, fallback){
    var el = document.querySelector('input[aria-label="' + label + '"]');
    var v = el ? el.value.trim() : '';
    return v || fallback;
  }

  function updateScript(){
    if(currentLevel === 'B2'){
      var s1 = '1) A PPO is ' + getInputVal('Mission 1','more flexible') + ' than an HMO when you need specialists.';
      var s2 = '2) This is ' + getInputVal('Mission 2','the most useful') + ' checklist for moving abroad.';
      var s3 = '3) I need ' + getInputVal('Mission 3','a') + ' primary care doctor, not the ER.';
      var s4 = '4) I ' + getInputVal('Mission 4','have lived') + ' here since 2020, so I can explain the basics.';
      var s5 = '5) You ' + getInputVal('Mission 5','should') + ' check if the provider is in-network.';
      var s6 = '6) ' + getInputVal('Mission 6','The United States') + ' is bigger than France, so planning matters.';
      var s7 = '7) ' + getInputVal('Mission B2-1','Although') + ' urgent care is cheaper, it can still be busy.';
      var s8 = '8) By next month, we ' + getInputVal('Mission B2-2','will have chosen') + ' our plan.';
      var closer = '\n\nB2 tip: add connectors (although/however/therefore) + vary tenses (present perfect, past perfect, future perfect).';
      $('#scriptOut').value = [s1,s2,s3,s4,s5,s6,s7,s8].join('\n') + closer;
    }else{
      var a1 = '1) Urgent care is ' + getInputVal('Mission 1','cheaper') + ' than the ER for minor issues.';
      var a2 = '2) This is ' + getInputVal('Mission 2','the most useful') + ' advice today.';
      var a3 = '3) I need ' + getInputVal('Mission 3','a') + ' doctor who speaks English.';
      var a4 = '4) I ' + getInputVal('Mission 4','have lived') + ' here since 2020, so I can explain the basics.';
      var a5 = '5) You ' + getInputVal('Mission 5','should') + ' bring your ID to the appointment.';
      var a6 = '6) ' + getInputVal('Mission 6','The United States') + ' is bigger than France, so planning matters.';
      var closerA = '\n\nFinal tip: Ask “general or specific?” before choosing a/an/the/Ø.';
      $('#scriptOut').value = [a1,a2,a3,a4,a5,a6].join('\n') + closerA;
    }
  }

  $('#btnCopyScript').addEventListener('click', function(){
    var text = $('#scriptOut').value;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){
        alert('Copied ✅ Now: have them read it out loud!');
      }).catch(function(){
        fallbackCopy(text);
      });
    }else{
      fallbackCopy(text);
    }
  });

  function fallbackCopy(text){
    var ta = $('#scriptOut');
    ta.focus(); ta.select();
    document.execCommand('copy');
    alert('Copied ✅');
  }

  // ---------- init ----------
  function init(){
    setScoreMax();
    initMcqGroup(document);
    initQcm(document);
    initAwards();
    initSpeech();
    initTabs();
    initGapFill();
    initTense();
    initDialogue();
    initMission();
    newTapOrder();
    newCompSentence();
    updateScript();

    // level switch
    var levelBtns = $$('[data-level-btn]');
    if(levelBtns.length){
      levelBtns.forEach(function(b){
        b.addEventListener('click', function(){
          levelBtns.forEach(function(x){ x.classList.remove('is-on'); x.setAttribute('aria-pressed','false'); });
          b.classList.add('is-on'); b.setAttribute('aria-pressed','true');
          applyLevel(b.getAttribute('data-level-btn'));
        });
      });
      // ensure initial visibility
      applyLevel(currentLevel);
    }

    // Copy Ø / ø buttons (article “nothing”)
    function copyText(txt){
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(function(){ alert('Copied: ' + txt); }).catch(function(){ fallbackCopy(txt); });
      }else{
        fallbackCopy(txt);
      }
    }
    function fallbackCopy(text){
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position='fixed';
      ta.style.left='-9999px';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try{ document.execCommand('copy'); }catch(e){}
      document.body.removeChild(ta);
      alert('Copied: ' + text);
    }
    var btnO = document.getElementById('btnCopyØ');
    var btno = document.getElementById('btnCopyø');
    if(btnO) btnO.addEventListener('click', function(){ copyText('Ø'); });
    if(btno) btno.addEventListener('click', function(){ copyText('ø'); });



    // teacher mode toggle
    btnTeacher.addEventListener('click', function(){ toggleTeacher(); updateUnlock(); });

    // reset
    $('#btnReset').addEventListener('click', function(){ resetAll(); updateUnlock(); });

    // initial mode label
    toggleTeacher(false);
    updateUnlock();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();