(function(){
  "use strict";
  var SESSIONS = [{"no": 1, "title": "Speaking comfort: introduce yourself with ease", "emoji": "🎤", "goal": "Help you answer personal and everyday questions more smoothly and naturally.", "focus": ["self-introduction", "where you live", "family & hobbies", "short follow-up answers"], "grammar": "present simple • there is/there are • prepositions of place", "useful": ["I live near…", "I work for…", "In my free time, I enjoy…", "What I like most is…"], "practice": "guided oral trainer + model answers + mini follow-up questions", "home": "Practise a 45–60 second self-introduction."}, {"no": 2, "title": "Listening and reacting with more confidence", "emoji": "🎧", "goal": "Help you catch key information and react calmly when you are not sure.", "focus": ["key words in questions", "asking for repetition", "checking understanding", "short natural reactions"], "grammar": "question forms • short answers • can/could for clarification", "useful": ["Could you repeat that, please?", "If I understand correctly…", "Do you mean…?", "Let me think for a moment."], "practice": "listen-and-respond activities + choice tasks + oral repetition", "home": "Listen to 3 short questions and answer with one complete sentence each."}, {"no": 3, "title": "Professional English for your work context", "emoji": "💼", "goal": "Help you present your job more clearly and handle simple professional situations.", "focus": ["talking about your role", "documents and partners", "explaining tasks", "simple workplace interaction"], "grammar": "present simple • wh- questions • useful job vocabulary", "useful": ["I work for CARSAT.", "I help with company documents.", "I work with different partners.", "My job involves…"], "practice": "roleplays + question prompts + practical vocabulary flashcards", "home": "Prepare 5 short sentences about your work."}, {"no": 4, "title": "Travel fluency: hotel, transport and practical situations", "emoji": "✈️", "goal": "Help you travel with more comfort and manage common real-life situations.", "focus": ["booking and arrival", "asking for directions", "solving a simple problem", "making polite requests"], "grammar": "can/could/would • imperatives • prepositions of movement", "useful": ["I have a reservation.", "Could you help me, please?", "How can I get to…?", "Is breakfast included?"], "practice": "travel simulations + decision cards + problem-solving dialogue", "home": "Revise your travel mini phrases and record yourself once."}, {"no": 5, "title": "Talking about past experiences and trips", "emoji": "🗺️", "goal": "Help you speak more easily about places you visited and things you did.", "focus": ["past travel memories", "weekend and holiday stories", "simple sequencing", "what you liked most"], "grammar": "past simple • was/were • then/after that/finally", "useful": ["Last summer, I went to…", "We stayed in…", "Then we visited…", "My favourite part was…"], "practice": "timeline speaking + sentence builders + guided mini story", "home": "Write or say 6 sentences about a past trip."}, {"no": 6, "title": "Better writing: messages, emails and useful structure", "emoji": "✍️", "goal": "Help you write clearer short texts with a more organised structure.", "focus": ["subject lines", "greetings and closings", "requests and information", "simple linked sentences"], "grammar": "capital letters • punctuation • and/but/so/because • polite forms", "useful": ["Subject: Reservation request", "Dear Sir or Madam,", "I am writing to…", "Best regards,"], "practice": "email model study + guided writing + correction ladder", "home": "Rewrite one email with a greeting, clear body and closing."}, {"no": 7, "title": "Giving opinions and making comparisons", "emoji": "💬", "goal": "Help you express what you think in a fuller and more natural way.", "focus": ["opinions", "preferences", "comparatives", "simple reasons and examples"], "grammar": "I think… • because… • comparative and superlative forms", "useful": ["In my opinion…", "I prefer… because…", "It is more… than…", "The best option is…"], "practice": "topic selector + model answers + compare-two-options tasks", "home": "Prepare one short spoken opinion on a familiar topic."}, {"no": 8, "title": "Problem-solving and polite communication", "emoji": "🛠️", "goal": "Help you stay calm and efficient when something goes wrong.", "focus": ["explaining a problem", "asking for help", "making a request", "responding politely"], "grammar": "can/could/would • have to/need to • simple conditionals", "useful": ["There is a problem with…", "Could you check that for me?", "I need some help with…", "If possible, I would like…"], "practice": "situational cards + oral roleplay + mini email repair task", "home": "Choose one problem situation and practise your response."}, {"no": 9, "title": "CLOE booster: integrated oral and written practice", "emoji": "🚀", "goal": "Help you bring everything together in a calm, exam-style way.", "focus": ["short oral answers", "follow-up questions", "writing under guidance", "timed but reassuring practice"], "grammar": "review and consolidation of core structures", "useful": ["First,… then… finally…", "For example,…", "Overall,…", "Thank you for your help."], "practice": "mini mock tasks + model answer reveal + self-check grid", "home": "Review your best phrases and your personalised correction notes."}, {"no": 10, "title": "Consolidation, confidence and personal next goals", "emoji": "🌟", "goal": "Help you see your progress clearly and choose the most useful next steps.", "focus": ["reviewing progress", "noticing strengths", "choosing priorities", "setting your next mini goals"], "grammar": "review according to your needs and favourite topics", "useful": ["I feel more comfortable with…", "I would like to improve…", "I can now…", "My next goal is…"], "practice": "progress reflection + practical revision game + personalised roadmap", "home": "Keep your favourite phrase bank and continue short regular speaking practice."}];

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
    });
  }

  var LS_KEY = 'se_frankie_roadmap_v1';
  var state = loadState();
  function loadState(){
    try{
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {checked:[], priority:'', likeMost:'', topicsWish:''};
    }catch(e){
      return {checked:[], priority:'', likeMost:'', topicsWish:''};
    }
  }
  function saveState(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){} }

  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ alert('Copied!'); }).catch(function(){ fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand('copy'); alert('Copied!'); }catch(e){ alert('Copy failed.'); }
    document.body.removeChild(ta);
  }

  $all('[data-scroll]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = $(btn.getAttribute('data-scroll'));
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  $('#btnPrint').addEventListener('click', function(){ window.print(); });
  $('#btnRevealNote').addEventListener('click', function(){
    var box = $('#revealNote');
    box.hidden = !box.hidden;
  });

  function renderSessions(){
    var wrap = $('#sessionList');
    wrap.innerHTML = '';
    SESSIONS.forEach(function(s){
      var details = document.createElement('details');
      details.className = 'session';
      details.innerHTML = ''
        + '<summary>'
        +   '<div class="session__left">'
        +     '<div class="session__emoji">' + esc(s.emoji) + '</div>'
        +     '<div><div class="session__title">Session ' + s.no + ' — ' + esc(s.title) + '</div><div class="session__sub">' + esc(s.goal) + '</div></div>'
        +   '</div>'
        +   '<div class="session__arrow">⌄</div>'
        + '</summary>'
        + '<div class="session__body">'
        +   '<div class="info-grid">'
        +     '<div class="info-box"><div class="info-box__title">🎯 Main goal</div><p>' + esc(s.goal) + '</p></div>'
        +     '<div class="info-box"><div class="info-box__title">🧱 Grammar & language focus</div><p>' + esc(s.grammar) + '</p></div>'
        +   '</div>'
        +   '<div class="info-grid">'
        +     '<div class="info-box"><div class="info-box__title">🔍 Focus areas</div><ul class="list">' + s.focus.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>'
        +     '<div class="info-box"><div class="info-box__title">💬 Useful phrases</div><div class="tag-bank">' + s.useful.map(function(x){ return '<span class="tag">' + esc(x) + '</span>'; }).join('') + '</div></div>'
        +   '</div>'
        +   '<div class="info-grid">'
        +     '<div class="info-box"><div class="info-box__title">🧪 In-session practice</div><p>' + esc(s.practice) + '</p></div>'
        +     '<div class="info-box"><div class="info-box__title">🏠 Between sessions</div><p>' + esc(s.home) + '</p></div>'
        +   '</div>'
        + '</div>';
      wrap.appendChild(details);
    });
  }

  function renderOpinion(){
    var wrap = $('#opinionGrid');
    wrap.innerHTML = '';
    SESSIONS.forEach(function(s){
      var row = document.createElement('label');
      row.className = 'opinion-item';
      var checked = state.checked.indexOf(s.no) !== -1 ? ' checked' : '';
      row.innerHTML = '<input type="checkbox" value="' + s.no + '"' + checked + ' /><div><strong>Session ' + s.no + '</strong><div>' + esc(s.title) + '</div></div>';
      var cb = row.querySelector('input');
      cb.addEventListener('change', function(){
        if(cb.checked){
          if(state.checked.indexOf(s.no) === -1) state.checked.push(s.no);
        } else {
          state.checked = state.checked.filter(function(n){ return n !== s.no; });
        }
        saveState();
      });
      wrap.appendChild(row);
    });
  }

  var priority = $('#prioritySelect');
  var likeMost = $('#likeMost');
  var topicsWish = $('#topicsWish');
  priority.value = state.priority || '';
  likeMost.value = state.likeMost || '';
  topicsWish.value = state.topicsWish || '';
  priority.addEventListener('change', function(){ state.priority = priority.value; saveState(); });
  likeMost.addEventListener('input', function(){ state.likeMost = likeMost.value; saveState(); });
  topicsWish.addEventListener('input', function(){ state.topicsWish = topicsWish.value; saveState(); });

  $('#btnCopyOpinion').addEventListener('click', function(){
    var chosen = SESSIONS.filter(function(s){ return state.checked.indexOf(s.no) !== -1; })
      .map(function(s){ return 'Session ' + s.no + ' — ' + s.title; })
      .join('\n');
    var text = 'My opinion on the next sessions plan:\n\n'
      + 'Sessions that sound especially useful to me:\n' + (chosen || 'None selected yet.') + '\n\n'
      + 'My first priority: ' + (state.priority || '—') + '\n\n'
      + 'What would help me the most:\n' + (state.likeMost || '—') + '\n\n'
      + 'Extra topics I would like to include:\n' + (state.topicsWish || '—');
    copyText(text);
  });

  $('#btnOpenAll').addEventListener('click', function(){ $all('.session').forEach(function(d){ d.open = true; }); });
  $('#btnCloseAll').addEventListener('click', function(){ $all('.session').forEach(function(d){ d.open = false; }); });

  renderSessions();
  renderOpinion();
})();
