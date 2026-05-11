(function(){
  "use strict";
  var DATA = {"student": "Frankie", "startLevel": "A1.1+", "startScore": "10/100", "targetLevel": "A1.2", "targetScore": "15/100", "resultLevel": "A2", "examDate": "30/04/2026", "results": [{"label": "Overall certification result", "value": "A2", "note": "A real step forward from the initial A1.1+ starting point."}, {"label": "Oral expression", "value": "A1+", "note": "You can speak about familiar topics and handle simple exchanges."}, {"label": "Interaction quality", "value": "A1+", "note": "You can ask/answer simple questions and take part in basic interaction."}, {"label": "Listening comprehension", "value": "A2", "note": "You can understand clear, slow speech on familiar topics."}, {"label": "Reading comprehension", "value": "B1-", "note": "A particularly encouraging point: you can understand straightforward factual texts on familiar topics."}], "startedWith": ["Very basic sentence building and a limited everyday vocabulary.", "Difficulty with oral comprehension when rhythm, accent or structure changed.", "Very short writing with punctuation, connector and preposition issues.", "Oral production focused on very simple family and weekend descriptions."], "accomplishments": [{"icon": "🎤", "title": "Speak more confidently", "desc": "You can now introduce yourself, talk about your family, describe where you live, discuss preferences and keep a simple conversation going."}, {"icon": "✈️", "title": "Manage travel situations", "desc": "You have practised airports, hotels, directions, reservations and practical travel communication — one of your original goals."}, {"icon": "💼", "title": "Talk about work", "desc": "You can now present your work context more clearly and use practical phrases for documents, requests and everyday professional situations."}, {"icon": "✍️", "title": "Write clearer messages", "desc": "You can organise short emails and simple written answers more effectively using greetings, basic structure and polite requests."}, {"icon": "🧠", "title": "Use better structure", "desc": "You uses clearer sentence patterns, more useful chunks and a stronger sense of how to build a complete answer."}, {"icon": "🌍", "title": "Understand more", "desc": "You have improved your ability to understand familiar written and spoken English, especially in practical contexts."}], "specificCanDo": ["Introduce yourself and give personal information in a more organised way.", "Talk about your home, your family, your hobbies and the places you like.", "Handle simple travel situations such as booking, arriving, asking and checking information.", "Write short practical messages and polite requests more clearly.", "Express simple opinions and preferences using better everyday vocabulary.", "Understand more of what you hear and read when the context is familiar."], "futureWork": [{"icon": "🚀", "title": "Longer, more natural speaking", "desc": "I will continue helping you speak for longer with smoother transitions, more spontaneity and more confidence in conversation."}, {"icon": "🛠️", "title": "Grammar accuracy", "desc": "We will keep strengthening key basics such as verb forms, prepositions, articles, sentence structure and question forms."}, {"icon": "🎧", "title": "Listening at natural speed", "desc": "We will continue training your ear so you feel more comfortable with different voices, faster rhythm and real-life audio."}, {"icon": "🧳", "title": "Travel fluency", "desc": "We will keep building practical English for trips, hotels, transport, restaurants and everyday problem-solving."}, {"icon": "💬", "title": "Richer vocabulary", "desc": "We will expand the vocabulary you can use actively so you feel freer and more precise when speaking or writing."}, {"icon": "🌟", "title": "Step-by-step progress", "desc": "The next lessons are there to consolidate, not start from zero. You have already built a strong base and will keep growing from it."}], "upgradePairs": [{"before": "My husband and me are alone.", "after": "My husband and I are at home on our own now.", "why": "Use “I” after “and”. The upgraded sentence is more natural."}, {"before": "I finish my work to 4 pm.", "after": "I finish work at 4 p.m.", "why": "Use “at” for clock times."}, {"before": "My weekend is a in a mountain with my husband and my dog.", "after": "At the weekend, I like spending time in the mountains with my husband and my dog.", "why": "The new version has better word order, a better preposition and more natural phrasing."}, {"before": "I like flower and landscape.", "after": "I enjoy painting flowers and landscapes.", "why": "Use plural countable nouns here and a more precise verb."}], "reflectionPrompts": ["What part of your progress are you the most proud of?", "What can you do now in English that felt difficult at the beginning?", "Which travel situation do you feel more ready for now?", "What would you like to improve even more in the next lessons?"], "timeline": [{"step": "Start", "title": "Initial analysis", "text": "You began with an initial level of A1.1+ and a very basic but motivated foundation."}, {"step": "Goal", "title": "Original target", "text": "The realistic target after the first training plan was A1.2."}, {"step": "Result", "title": "CLOE success", "text": "You obtained an overall CLOE result of A2 on 30/04/2026."}, {"step": "Next", "title": "Continuation", "text": "You continue your training with a stronger base, more confidence and clear future goals."}]};
  function $(sel, root){ return (root||document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
  var LS_KEY = 'se_frankie_celebration_v1';
  var state = loadState();

  function loadState(){
    try{
      var s = localStorage.getItem(LS_KEY);
      return s ? JSON.parse(s) : { promptIndex:0, revealDone:false, notes:'', takeaway:{proud:'',canDo:'',next:''} };
    }catch(e){
      return { promptIndex:0, revealDone:false, notes:'', takeaway:{proud:'',canDo:'',next:''} };
    }
  }
  function saveState(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
  }
  function copyText(text){
    var t = String(text||'');
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){ alert('Copied!'); }).catch(function(){ fallbackCopy(t); });
    }else{ fallbackCopy(t); }
  }
  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position='fixed'; ta.style.left='-9999px';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try{ document.execCommand('copy'); alert('Copied!'); }catch(e){ alert('Copy failed.'); }
    document.body.removeChild(ta);
  }
  function speak(text){
    if(!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)){
      alert('Text-to-speech is not available in this browser.');
      return;
    }
    try{ window.speechSynthesis.cancel(); }catch(e){}
    var u = new SpeechSynthesisUtterance(String(text||''));
    u.lang = 'en-GB';
    u.rate = 0.98;
    window.speechSynthesis.speak(u);
  }

  document.documentElement.style.setProperty('--accent', '#b16b7b');
  $('#startLevelHero').textContent = DATA.startLevel;
  $('#targetLevelHero').textContent = DATA.targetLevel;
  $('#resultLevelHero').textContent = DATA.resultLevel;
  $('#startBox').textContent = DATA.startLevel;
  $('#goalBox').textContent = DATA.targetLevel;
  $('#resultBox').textContent = DATA.resultLevel;

  $all('[data-scroll]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = btn.getAttribute('data-scroll');
      var el = $(target);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  $('#btnPrint').addEventListener('click', function(){ window.print(); });

  function renderTimeline(){
    var wrap = $('#timeline');
    wrap.innerHTML = '';
    DATA.timeline.forEach(function(item){
      var card = document.createElement('article');
      card.className = 'tl-card' + (state.revealDone ? ' revealed' : '');
      card.innerHTML = '<div class="tl-step">'+ escapeHtml(item.step) +'</div>'+
        '<div class="tl-title">'+ escapeHtml(item.title) +'</div>'+
        '<div class="tl-text">'+ escapeHtml(item.text) +'</div>';
      wrap.appendChild(card);
    });
  }
  $('#btnRevealStory').addEventListener('click', function(){
    state.revealDone = true; saveState(); renderTimeline();
  });

  function renderStarted(){
    var ul = $('#startedList'); ul.innerHTML='';
    DATA.startedWith.forEach(function(line){
      var li = document.createElement('li'); li.textContent = line; ul.appendChild(li);
    });
  }
  function renderResults(){
    var wrap = $('#resultList'); wrap.innerHTML='';
    DATA.results.forEach(function(r){
      var row = document.createElement('div'); row.className='result-row';
      row.innerHTML = '<div class="result-row__value">'+ escapeHtml(r.value) +'</div>'+
        '<div class="result-row__body"><strong>'+ escapeHtml(r.label) +'</strong><span>'+ escapeHtml(r.note) +'</span></div>';
      wrap.appendChild(row);
    });
  }

  function renderAccomplishments(showAll){
    var wrap = $('#accomplishmentGrid'); wrap.innerHTML='';
    DATA.accomplishments.forEach(function(card, idx){
      var el = document.createElement('div');
      el.className = 'flip';
      el.innerHTML = '<div class="flip__inner">'+
        '<div class="flip__face">'+
          '<div><div class="flip__icon">'+ escapeHtml(card.icon) +'</div><div class="flip__title">'+ escapeHtml(card.title) +'</div></div>'+
          '<div class="flip__hint">Tap to see what this means.</div>'+
        '</div>'+
        '<div class="flip__face flip__back">'+
          '<div><div class="flip__icon">'+ escapeHtml(card.icon) +'</div><div class="flip__title">'+ escapeHtml(card.title) +'</div></div>'+
          '<div class="flip__desc">'+ escapeHtml(card.desc) +'</div>'+
        '</div>'+
      '</div>';
      if(showAll){ el.classList.add('is-flipped'); }
      el.addEventListener('click', function(){ el.classList.toggle('is-flipped'); });
      el.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.classList.toggle('is-flipped'); } });
      el.tabIndex = 0;
      wrap.appendChild(el);
    });
  }
  $('#btnShowAllCards').addEventListener('click', function(){ renderAccomplishments(true); });

  function renderCanDo(){
    var wrap = $('#canDoBoard'); wrap.innerHTML='';
    DATA.specificCanDo.forEach(function(line){
      var item = document.createElement('div');
      item.className = 'can-do';
      item.innerHTML = '<div class="can-do__icon">🌈</div><div class="can-do__text">'+ escapeHtml(line) +'</div>';
      wrap.appendChild(item);
    });
  }

  function renderUpgradeSelect(){
    var sel = $('#upgradeSelect');
    sel.innerHTML = '';
    DATA.upgradePairs.forEach(function(item, idx){
      var o = document.createElement('option');
      o.value = String(idx);
      o.textContent = 'Example ' + (idx+1);
      sel.appendChild(o);
    });
    sel.addEventListener('change', updateUpgradePanel);
    updateUpgradePanel();
  }
  function updateUpgradePanel(){
    var idx = parseInt($('#upgradeSelect').value || '0', 10);
    var item = DATA.upgradePairs[idx] || DATA.upgradePairs[0];
    $('#upgradeBefore').textContent = item.before;
    $('#upgradeAfter').textContent = item.after;
    $('#upgradeWhy').textContent = item.why;
  }

  function setPrompt(idx){
    var i = ((idx % DATA.reflectionPrompts.length) + DATA.reflectionPrompts.length) % DATA.reflectionPrompts.length;
    state.promptIndex = i; saveState();
    $('#reflectionPrompt').textContent = DATA.reflectionPrompts[i];
  }
  $('#btnNewPrompt').addEventListener('click', function(){ setPrompt(state.promptIndex + 1); });
  $('#btnListenPrompt').addEventListener('click', function(){ speak($('#reflectionPrompt').textContent); });
  $('#btnCopyPrompt').addEventListener('click', function(){ copyText($('#reflectionPrompt').textContent); });

  function renderFuture(){
    var wrap = $('#futureGrid'); wrap.innerHTML='';
    DATA.futureWork.forEach(function(item){
      var card = document.createElement('article');
      card.className = 'future-card';
      card.innerHTML = '<div class="future-card__icon">'+ escapeHtml(item.icon) +'</div>'+
        '<div class="future-card__title">'+ escapeHtml(item.title) +'</div>'+
        '<div class="future-card__desc">'+ escapeHtml(item.desc) +'</div>';
      wrap.appendChild(card);
    });
  }

  $('#btnRevealAffirmation').addEventListener('click', function(){
    var box = $('#affirmationText');
    box.hidden = !box.hidden;
  });

  var notes = $('#reflectionNotes');
  notes.value = state.notes || '';
  notes.addEventListener('input', function(){ state.notes = notes.value; saveState(); });

  var takeProud = $('#takeProud'), takeCanDo = $('#takeCanDo'), takeNext = $('#takeNext');
  takeProud.value = state.takeaway.proud || '';
  takeCanDo.value = state.takeaway.canDo || '';
  takeNext.value = state.takeaway.next || '';
  [takeProud, takeCanDo, takeNext].forEach(function(el){
    el.addEventListener('input', function(){
      state.takeaway.proud = takeProud.value;
      state.takeaway.canDo = takeCanDo.value;
      state.takeaway.next = takeNext.value;
      saveState();
    });
  });
  $('#btnCopyTakeaway').addEventListener('click', function(){
    var text = 'I am proud of: ' + (takeProud.value || '') + '\n\n' +
      'I can now: ' + (takeCanDo.value || '') + '\n\n' +
      'In our next lessons, I want to: ' + (takeNext.value || '');
    copyText(text);
  });

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m]; });
  }

  renderTimeline();
  renderStarted();
  renderResults();
  renderAccomplishments(false);
  renderCanDo();
  renderUpgradeSelect();
  renderFuture();
  setPrompt(state.promptIndex || 0);
})();