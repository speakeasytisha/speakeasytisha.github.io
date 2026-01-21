window.__SPEAKEASY_APP_LOADED = true;
/* SpeakEasyTisha — School Communication Grammar
   Polite requests · Dates · Time · Letters
   Works on Mac + iPad Safari: every drag activity also has TAP MODE.
*/
(function(){
  'use strict';

  // ---------------------------
  // Helpers
  // ---------------------------
  function $(id){ return document.getElementById(id); }
  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];
    });
  }
  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

  // ---------------------------
  // Persistent score
  // ---------------------------
  var LS_KEY_SCORE = 'setisha_school_comm_grammar_score_v1';
  var LS_KEY_DONE  = 'setisha_school_comm_grammar_done_v1';
  var score = 0;
  var done = {};

  function loadState(){
    var s = parseInt(localStorage.getItem(LS_KEY_SCORE) || '0', 10);
    score = isNaN(s) ? 0 : s;
    try { done = JSON.parse(localStorage.getItem(LS_KEY_DONE) || '{}') || {}; }
    catch(e){ done = {}; }
  }
  function saveState(){
    localStorage.setItem(LS_KEY_SCORE, String(score));
    localStorage.setItem(LS_KEY_DONE, JSON.stringify(done));
  }
  function setScore(delta, token){
    if (token && done[token]) return;
    if (token) done[token] = true;
    score += delta;
    if (score < 0) score = 0;
    updateScoreUI();
    saveState();
  }
  function updateScoreUI(){
    if ($('scoreTop')) $('scoreTop').textContent = String(score);
    if ($('scoreBottom')) $('scoreBottom').textContent = String(score);
  }

  // ---------------------------
  // TTS (US/UK) — robust for Safari/Chrome
  // ---------------------------
  var accent = 'en-US';

  var tts = {
    voices: [],
    unlocked: false,
    statusEl: null,
    current: null,
    init: function(){
      this.statusEl = $('ttsStatus');
      this.warmup();
      if (typeof window.isSecureContext !== 'undefined' && !window.isSecureContext) {
        this.setStatus('Voice: disabled on file:// — open via https (GitHub) or localhost');
      }
      var self=this;
      var once=function(){ try{ self.unlock&&self.unlock(); }catch(e){}; window.removeEventListener('pointerdown',once,true); window.removeEventListener('touchstart',once,true); window.removeEventListener('mousedown',once,true); };
      window.addEventListener('pointerdown',once,true);
      window.addEventListener('touchstart',once,true);
      window.addEventListener('mousedown',once,true);
    },
    setStatus: function(msg){
      if (this.statusEl) this.statusEl.textContent = msg;
    },
    warmup: function(){
      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
        this.setStatus('Voice: not supported');
        return;
      }
      try { window.speechSynthesis.getVoices(); } catch(e) {}
      this.voices = window.speechSynthesis.getVoices() || [];
      this.setStatus(this.voices.length ? ('Voice: ready (' + this.voices.length + ' voices)') : 'Voice: loading…');
      var self = this;
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = function(){
          self.voices = window.speechSynthesis.getVoices() || [];
          self.setStatus(self.voices.length ? ('Voice: ready (' + self.voices.length + ' voices)') : 'Voice: loading…');
        };
      }
    },
    pick: function(lang){
      var voices = (this.voices && this.voices.length) ? this.voices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
      if (!voices || !voices.length) return null;
      var lower = String(lang || '').toLowerCase();
      // exact match
      for (var i=0;i<voices.length;i++){
        if (String(voices[i].lang || '').toLowerCase() === lower) return voices[i];
      }
      // prefix match
      var pref = lower.split('-')[0];
      for (var j=0;j<voices.length;j++){
        var vl = String(voices[j].lang || '').toLowerCase();
        if (vl.indexOf(pref) == 0) return voices[j];
      }
      return voices[0];
    },
    speakNow: function(text){
      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return;
      var say = String(text || '').trim();
      if (!say) return;
      try { window.speechSynthesis.resume(); } catch(e) {}
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) window.speechSynthesis.cancel();
      } catch(e2) {}

      // iOS/Safari unlock: queue a silent utterance on first user action
      if (!this.unlocked){
        try {
          var warm = new SpeechSynthesisUtterance(' ');
          warm.lang = accent;
          warm.volume = 0;
          window.speechSynthesis.speak(warm);
          this.unlocked = true;
        } catch(e3) {}
      }

      var u = new SpeechSynthesisUtterance(say);
      u.lang = accent;
      u.rate = 0.95;
      var v = this.pick(accent);
      if (v) u.voice = v;

      var self = this;
      u.onstart = function(){ self.setStatus('Voice: speaking…'); };
      u.onend = function(){ self.setStatus(self.voices.length ? ('Voice: ready (' + self.voices.length + ' voices)') : 'Voice: ready'); };
      u.onerror = function(){ self.setStatus('Voice: error — tap Test voice again'); };

      this.current = u;
      window.speechSynthesis.speak(u);
    }
  };

  function setAccent(next){
    accent = next;
    $('accentUS').setAttribute('aria-pressed', next === 'en-US' ? 'true' : 'false');
    $('accentUK').setAttribute('aria-pressed', next === 'en-GB' ? 'true' : 'false');
    tts.warmup();
  }

  function speak(text){
    tts.speakNow(text);
  }

  // ---------------------------
  // French help toggle
  // ---------------------------
  var helpOn = false;
  function setHelp(on){
    helpOn = !!on;
    $('helpOn').setAttribute('aria-pressed', helpOn ? 'true' : 'false');
    $('helpOff').setAttribute('aria-pressed', helpOn ? 'false' : 'true');
    qa('[data-help]').forEach(function(el){
      el.style.display = helpOn ? 'block' : 'none';
    });
  }

  // ---------------------------
  // MCQ builder
  // ---------------------------
  function renderMCQ(targetEl, items, tokenPrefix){
    targetEl.innerHTML = '';
    items.forEach(function(item, idx){
      var card = document.createElement('div');
      card.className = 'qCard';

      var p = document.createElement('p');
      p.className = 'qPrompt';
      p.textContent = item.q;
      card.appendChild(p);

      var opts = document.createElement('div');
      opts.className = 'options';

      var explained = document.createElement('div');
      explained.className = 'explain';
      explained.hidden = true;

      item.options.forEach(function(opt){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'optBtn';
        b.textContent = opt;
        b.addEventListener('click', function(){
          // lock after first correct selection
          if (card.getAttribute('data-done') === 'true') return;

          var isRight = (opt === item.a);
          if (isRight){
            b.setAttribute('data-state','right');
            card.setAttribute('data-done','true');
            setScore(2, tokenPrefix + '_' + idx);
          } else {
            b.setAttribute('data-state','wrong');
          }
          explained.textContent = item.explain;
          explained.hidden = false;
        });
        opts.appendChild(b);
      });

      card.appendChild(opts);
      card.appendChild(explained);
      targetEl.appendChild(card);
    });
  }

  // ---------------------------
  // Tap/Drag utilities
  // ---------------------------
  function isTouchLikely(){
    return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  }

  // Generic: tiles to a drop container (sentence builder style)
  function initTileToBox(tilesEl, boxEl, words){
    tilesEl.innerHTML = '';
    boxEl.innerHTML = '';

    var picked = null; // element

    function clearPicked(){
      qa('.tile', tilesEl).forEach(function(t){ t.dataset.picked = 'false'; });
      picked = null;
    }

    function makeTile(text){
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'tile';
      t.textContent = text;
      t.setAttribute('draggable', 'true');

      t.addEventListener('click', function(){
        // tap mode support
        var nowPicked = (t.dataset.picked === 'true');
        clearPicked();
        if (!nowPicked){
          t.dataset.picked = 'true';
          picked = t;
        }
      });

      t.addEventListener('dragstart', function(ev){
        try{ ev.dataTransfer.setData('text/plain', text); } catch(e) {}
      });

      return t;
    }

    words.forEach(function(w){ tilesEl.appendChild(makeTile(w)); });

    // Drop logic
    boxEl.addEventListener('dragover', function(ev){ ev.preventDefault(); });
    boxEl.addEventListener('drop', function(ev){
      ev.preventDefault();
      var txt = '';
      try{ txt = ev.dataTransfer.getData('text/plain'); } catch(e) { txt = ''; }
      if (!txt) return;
      addWordToBox(txt);
    });

    boxEl.addEventListener('click', function(){
      if (!picked) return;
      addWordToBox(picked.textContent);
      picked.dataset.picked = 'false';
      picked = null;
    });

    function addWordToBox(word){
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'tile';
      chip.textContent = word;
      chip.title = 'Tap to remove';
      chip.addEventListener('click', function(){
        boxEl.removeChild(chip);
      });
      boxEl.appendChild(chip);
    }

    return {
      reset: function(){ tilesEl.innerHTML=''; boxEl.innerHTML=''; words.forEach(function(w){ tilesEl.appendChild(makeTile(w)); }); clearPicked(); },
      getSentence: function(){ return qa('.tile', boxEl).map(function(n){ return n.textContent; }).join(' ').replace(/\s+/g,' ').trim(); },
      speakSentence: function(){ speak(this.getSentence()); }
    };
  }

  // DnD labels to slots (letter parts)
  function initLabelToSlots(root){
    var tiles = qa('.tile', root);
    var slots = qa('.slot', root);
    var picked = null; // tile

    function reset(){
      // Move any placed tiles back to tile bank
      var bank = q('.dnd__tiles', root);
      qa('.slot__drop .tile', root).forEach(function(t){
        t.dataset.picked = 'false';
        bank.appendChild(t);
      });
      picked = null;
      tiles = qa('.tile', root);
      tiles.forEach(function(t){ t.dataset.picked = 'false'; t.setAttribute('draggable','true'); });
    }

    function pickTile(t){
      tiles.forEach(function(x){ x.dataset.picked = 'false'; });
      if (t){
        t.dataset.picked = 'true';
        picked = t;
      } else {
        picked = null;
      }
    }

    tiles.forEach(function(t){
      t.setAttribute('draggable','true');
      t.addEventListener('click', function(){
        if (t.dataset.picked === 'true'){ pickTile(null); }
        else { pickTile(t); }
      });
      t.addEventListener('dragstart', function(ev){
        try{ ev.dataTransfer.setData('text/plain', t.dataset.tile); } catch(e) {}
      });
    });

    slots.forEach(function(slot){
      slot.addEventListener('click', function(){
        if (!picked) return;
        var drop = q('.slot__drop', slot);
        drop.appendChild(picked);
        picked.dataset.picked = 'false';
        picked = null;
      });
      slot.addEventListener('dragover', function(ev){ ev.preventDefault(); });
      slot.addEventListener('drop', function(ev){
        ev.preventDefault();
        var key = '';
        try{ key = ev.dataTransfer.getData('text/plain'); } catch(e) { key = ''; }
        if (!key) return;
        var t = q('.tile[data-tile="' + key + '"]', root);
        if (!t) return;
        q('.slot__drop', slot).appendChild(t);
      });
    });

    function check(){
      var ok = 0;
      slots.forEach(function(slot){
        var need = slot.dataset.slot;
        var placed = q('.slot__drop .tile', slot);
        if (placed && placed.dataset.tile === need) ok++;
      });
      return { ok: ok, total: slots.length };
    }

    return { reset: reset, check: check, pickTile: pickTile };
  }

  // ---------------------------
  // Exercise content
  // ---------------------------
  var politeSummary = 'In school emails and phone calls, use polite requests. Could or Would are softer than Can. Add please, and use indirect questions like: Could you tell me which documents are required?';
  var datesSummary  = 'Write dates clearly in US format. Use on for days and dates, in for months and years, and at for clock times. In emails, prefer January 20, 2026 instead of 20/01/2026.';
  var lettersSummary = 'A good school email has a clear subject, a greeting, a purpose, key details, a specific request, and a polite closing. Keep it short and easy to answer.';
  var practiceSummary = 'Use the generator to create a ready-to-send message. Choose your scenario, then copy or listen. Focus on clear dates, times, and polite request language.';

  // ---------------------------
  // Exercise A: Polite MCQ
  // ---------------------------
  var politeMCQ = [
    {
      q: 'You want the school to send you the registration forms. Choose the most polite email sentence.',
      options: [
        'Send me the forms.',
        'Can you send me the forms?',
        'Could you please email me the registration forms?',
        'You will email me the forms.'
      ],
      a: 'Could you please email me the registration forms?',
      explain: 'Use Could + please for a polite request. Keep it clear and specific.'
    },
    {
      q: 'You want to ask about an interpreter. Which option sounds best?',
      options: [
        'I need an interpreter.',
        'Do you have an interpreter available for meetings?',
        'Give me an interpreter for French.',
        'Interpreter, please.'
      ],
      a: 'Do you have an interpreter available for meetings?',
      explain: 'A question is softer than a demand. You can also add: "Could we request one?"'
    },
    {
      q: 'You want to schedule a school tour. Which is most natural?',
      options: [
        'I want a tour now.',
        'Would it be possible to schedule a school tour?',
        'Schedule a tour for me.',
        'I schedule tour.'
      ],
      a: 'Would it be possible to schedule a school tour?',
      explain: 'Would it be possible… is very polite and common in school communication.'
    }
  ];

  // ---------------------------
  // Exercise B: Polite sentence builder
  // ---------------------------
  var politeWords = ['Could','you','please','tell','me','which','documents','are','required','to','register','?'];
  var politeTarget = 'Could you please tell me which documents are required to register ?';

  // ---------------------------
  // Exercise D: Prepositions MCQ
  // ---------------------------
  var timeMCQ = [
    {
      q: 'We are arriving ___ September.',
      options: ['on','in','at','to'],
      a: 'in',
      explain: 'Use in + month: in September.'
    },
    {
      q: 'Can we meet ___ Monday?',
      options: ['in','on','at','from'],
      a: 'on',
      explain: 'Use on + day: on Monday.'
    },
    {
      q: 'The appointment is ___ 10:30 a.m.',
      options: ['in','on','at','for'],
      a: 'at',
      explain: 'Use at + clock time: at 10:30 a.m.'
    },
    {
      q: 'My child was born ___ 2014.',
      options: ['in','on','at','to'],
      a: 'in',
      explain: 'Use in + year: in 2014.'
    }
  ];

  // ---------------------------
  // Exercise F: Letter parts DnD
  // ---------------------------
  var letterDndApi = null;

  // ---------------------------
  // Exercise G: Fill-in email
  // ---------------------------
  var emailBank = [
    { key:'subject', text:'Enrollment appointment request' },
    { key:'greeting', text:'Dear Registrar,' },
    { key:'purpose', text:'request an enrollment appointment' },
    { key:'arrival', text:'in January' },
    { key:'age', text:'10 years old' },
    { key:'grade', text:'5th grade' },
    { key:'request', text:'Could you please tell me which documents are required?' },
    { key:'signoff', text:'Kind regards' }
  ];
  var emailCorrect = {
    subject:'Enrollment appointment request',
    greeting:'Dear Registrar,',
    purpose:'request an enrollment appointment',
    arrival:'in January',
    age:'10 years old',
    grade:'5th grade',
    request:'Could you please tell me which documents are required?',
    signoff:'Kind regards'
  };

  function initEmailFill(){
    var bankEl = $('emailWordbank');
    var blanks = qa('.blank[data-blank]');
    var picked = null;

    function reset(){
      bankEl.innerHTML = '';
      blanks.forEach(function(b){ b.textContent = ''; b.dataset.filled = 'false'; b.removeAttribute('data-val'); });
      picked = null;
      $('emailFeedback').textContent = '';
      $('emailFeedback').className = 'feedback';
      $('emailHint').hidden = true;

      emailBank.forEach(function(item){
        var t = document.createElement('button');
        t.type = 'button';
        t.className = 'tile';
        t.textContent = item.text;
        t.dataset.key = item.key;
        t.addEventListener('click', function(){
          // pick/unpick
          qa('.tile', bankEl).forEach(function(x){ x.dataset.picked = 'false'; });
          if (t.dataset.picked === 'true'){
            t.dataset.picked = 'false';
            picked = null;
          } else {
            t.dataset.picked = 'true';
            picked = t;
          }
        });
        bankEl.appendChild(t);
      });

      blanks.forEach(function(b){
        b.addEventListener('click', function(){
          if (!picked) return;
          // place picked text
          b.textContent = picked.textContent;
          b.dataset.filled = 'true';
          b.dataset.val = picked.textContent;
          // do not remove from bank (allows retry)
          picked.dataset.picked = 'false';
          picked = null;
        });
      });
    }

    function hint(){
      $('emailHint').innerHTML = 'Try this pattern: <em>Dear Registrar,</em> + <em>I am writing to…</em> + arrival date + child age/grade + polite request.';
      $('emailHint').hidden = false;
    }

    function check(){
      var ok = 0;
      var total = Object.keys(emailCorrect).length;
      blanks.forEach(function(b){
        var k = b.dataset.blank;
        if (emailCorrect[k] && b.dataset.val === emailCorrect[k]) ok++;
      });

      var fb = $('emailFeedback');
      if (ok === total){
        fb.className = 'feedback good';
        fb.textContent = '✅ Perfect. This email is clear and polite.';
        setScore(12, 'email_fill');
      } else {
        fb.className = 'feedback bad';
        fb.textContent = 'Not yet: ' + ok + '/' + total + ' correct. Fix the parts that sound too direct or unclear.';
      }
    }

    function listen(){
      var lines = [];
      lines.push('Subject: ' + (q('.blank[data-blank="subject"]').textContent || ''));
      lines.push(q('.blank[data-blank="greeting"]').textContent || '');
      lines.push('I am writing to ' + (q('.blank[data-blank="purpose"]').textContent || '') + '.');
      lines.push('We are moving from France and we will arrive ' + (q('.blank[data-blank="arrival"]').textContent || '') + '.');
      lines.push('My child is ' + (q('.blank[data-blank="age"]').textContent || '') + ' and we would like to enroll in ' + (q('.blank[data-blank="grade"]').textContent || '') + '.');
      lines.push(q('.blank[data-blank="request"]').textContent || '');
      lines.push('Thank you for your help.');
      lines.push((q('.blank[data-blank="signoff"]').textContent || '') + ',');
      speak(lines.join(''));
    }

    $('emailHintBtn').addEventListener('click', hint);
    $('emailCheckBtn').addEventListener('click', check);
    $('emailResetBtn').addEventListener('click', reset);
    $('emailListenBtn').addEventListener('click', listen);

    reset();
  }

  // ---------------------------
  // Date converter exercise
  // ---------------------------
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function parseFRDate(s){
    var m = String(s || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    var dd = parseInt(m[1],10);
    var mm = parseInt(m[2],10);
    var yy = parseInt(m[3],10);
    if (isNaN(dd)||isNaN(mm)||isNaN(yy)) return null;
    if (mm < 1 || mm > 12) return null;
    if (dd < 1 || dd > 31) return null;
    return { dd: dd, mm: mm, yy: yy };
  }

  function two(n){ return (n<10?'0':'') + n; }

  function toUSNumeric(fr){
    return two(fr.mm) + '/' + two(fr.dd) + '/' + fr.yy;
  }

  function toUSWords(fr){
    return MONTHS[fr.mm-1] + ' ' + fr.dd + ', ' + fr.yy;
  }

  function initDateExercise(){
    function reset(){
      $('dateInput').value = '';
      $('dateResult').textContent = '';
      $('dateHint').hidden = true;
    }

    $('dateConvert').addEventListener('click', function(){
      var parsed = parseFRDate($('dateInput').value);
      if (!parsed){
        $('dateResult').textContent = 'Please enter a date like 20/01/2026.';
        $('dateResult').style.color = 'var(--bad)';
        return;
      }
      var usNum = toUSNumeric(parsed);
      var usWords = toUSWords(parsed);
      $('dateResult').style.color = 'var(--muted)';
      $('dateResult').textContent = 'US numeric: ' + usNum + 'Recommended (words): ' + usWords;
      setScore(6, 'date_convert');
    });

    $('dateReset').addEventListener('click', reset);
    $('dateShowHint').addEventListener('click', function(){ $('dateHint').hidden = false; });
    $('dateListen').addEventListener('click', function(){
      var parsed = parseFRDate($('dateInput').value);
      if (!parsed) { speak('Please enter a date.'); return; }
      speak('In a US email, write: ' + toUSWords(parsed) + '.');
    });

    reset();
  }

  // ---------------------------
  // Schedule sentence builder
  // ---------------------------
  function initSchedule(){
    function reset(){
      $('daySelect').value = '';
      $('timeSelect').value = '';
      $('structureSelect').value = '';
      $('scheduleResult').textContent = 'Pick options, then build your sentence.';
    }

    function build(){
      var day = $('daySelect').value;
      var time = $('timeSelect').value;
      var st = $('structureSelect').value;
      if (!day || !time || !st){
        $('scheduleResult').textContent = 'Choose a day, a time, and a structure.';
        return;
      }
      var sentence = st + ' on ' + day + ' at ' + time + '?';
      $('scheduleResult').textContent = sentence;
      setScore(8, 'schedule_sentence');
    }

    $('scheduleBuild').addEventListener('click', build);
    $('scheduleReset').addEventListener('click', reset);
    $('scheduleListen').addEventListener('click', function(){ speak($('scheduleResult').textContent); });

    reset();
  }

  // ---------------------------
  // Polite builder (Exercise B)
  // ---------------------------
  var politeBuilderApi = null;

  function initPoliteBuilder(){
    politeBuilderApi = initTileToBox($('politeTiles'), $('politeSentence'), politeWords);

    function hint(){
      $('politeHint').innerHTML = 'Start with <strong>Could you please</strong> … then <em>tell me</em> … then the noun phrase: <em>which documents are required</em>.';
      $('politeHint').hidden = false;
    }

    function reset(){
      $('politeHint').hidden = true;
      $('politeFeedback').textContent = '';
      $('politeFeedback').className = 'feedback';
      politeBuilderApi.reset();
    }

    function check(){
      var got = politeBuilderApi.getSentence();
      var fb = $('politeFeedback');
      // normalize spaces
      var norm = function(s){ return String(s||'').replace(/\s+/g,' ').trim(); };
      if (norm(got) === norm(politeTarget)){
        fb.className = 'feedback good';
        fb.textContent = '✅ Great! This is a polite, clear request.';
        setScore(5, 'polite_builder');
      } else {
        fb.className = 'feedback bad';
        fb.textContent = 'Not yet. Check word order and include "please".';
      }
    }

    function play(){
      speak(politeBuilderApi.getSentence() || '');
    }

    q('[data-hint="politeHint"]').addEventListener('click', hint);
    q('[data-reset="politeReset"]').addEventListener('click', reset);
    q('[data-check="politeCheck"]').addEventListener('click', check);
    q('[data-say="politePlay"]').addEventListener('click', play);

    reset();
  }

  // ---------------------------
  // Letter DnD
  // ---------------------------
  function initLetterDnD(){
    var root = $('letterDnD');
    letterDndApi = initLabelToSlots(root);

    function hint(){
      $('letterHint').innerHTML = 'Order: Subject → Greeting → Purpose → Details → Request → Closing → Sign-off.';
      $('letterHint').hidden = false;
    }

    function reset(){
      $('letterHint').hidden = true;
      $('letterFeedback').textContent = '';
      $('letterFeedback').className = 'feedback';
      letterDndApi.reset();
    }

    function check(){
      var res = letterDndApi.check();
      var fb = $('letterFeedback');
      if (res.ok === res.total){
        fb.className = 'feedback good';
        fb.textContent = '✅ Perfect. You placed every part correctly.';
        setScore(10, 'letter_parts');
      } else {
        fb.className = 'feedback bad';
        fb.textContent = 'Not yet: ' + res.ok + '/' + res.total + ' correct. Try again.';
      }
    }

    q('[data-hint="letterHint"]').addEventListener('click', hint);
    q('[data-reset="letterReset"]').addEventListener('click', reset);
    q('[data-check="letterCheck"]').addEventListener('click', check);

    reset();
  }

  // ---------------------------
  // Generator + quiz
  // ---------------------------
  function buildMessage(opts){
    var scenario = opts.scenario;
    var state = opts.state;
    var town = opts.town;
    var parent = opts.parent;
    var child = opts.child;
    var age = opts.age;
    var grade = opts.grade;
    var arrive = opts.arrive;
    var extra = opts.extra;

    var subject = '';
    var greeting = 'Dear Registrar,';
    var lines = [];

    if (!parent) parent = 'Parent';
    if (!child) child = 'my child';

    if (scenario === 'enroll'){
      subject = 'Enrollment appointment request';
      lines.push(greeting);
      lines.push('');
      lines.push('My name is ' + parent + '. I am writing to request an enrollment appointment.');
      if (arrive) lines.push('We will arrive ' + arrive + ' and we will live in ' + town + ', ' + state + '.');
      else lines.push('We are moving from France and we will live in ' + town + ', ' + state + '.');
      if (age || grade) lines.push(child + ' is ' + (age ? age + ' years old' : 'a student') + (grade ? ' and we would like to enroll in ' + grade + '.' : '.'));
      lines.push('Could you please tell me which documents are required and what your available appointment times are?');
      lines.push('');
      lines.push('Thank you for your help.');
      lines.push('Kind regards,');
      lines.push(parent);
    }

    if (scenario === 'interpreter'){
      subject = 'Interpreter request for meetings';
      lines.push(greeting);
      lines.push('');
      lines.push('My name is ' + parent + '. We are moving from France and we will enroll ' + child + '.');
      lines.push('Do you have an interpreter available for meetings?');
      if (extra) lines.push('Preferred language: ' + extra + '.');
      lines.push('');
      lines.push('Thank you very much.');
      lines.push('Kind regards,');
      lines.push(parent);
    }

    if (scenario === 'ell'){
      subject = 'Question about ELL / ESL support';
      lines.push(greeting);
      lines.push('');
      lines.push('I am writing to ask about English Learner (ELL/ESL) support for ' + child + '.');
      if (age || grade) lines.push(child + ' is ' + (age ? age + ' years old' : '') + (grade ? ' and we are interested in ' + grade + '.' : '.'));
      lines.push('Could you please explain the screening process and the support options available in your school?');
      lines.push('');
      lines.push('Thank you for your help.');
      lines.push('Kind regards,');
      lines.push(parent);
    }

    if (scenario === 'eval'){
      subject = 'Request for evaluation (IEP / 504)';
      lines.push(greeting);
      lines.push('');
      lines.push('I am writing to request information about an evaluation for support (IEP or 504) for ' + child + '.');
      if (extra) lines.push('Concern: ' + extra + '.');
      lines.push('Could you please tell me the next steps and who we should contact to begin the process?');
      lines.push('');
      lines.push('Thank you for your time.');
      lines.push('Kind regards,');
      lines.push(parent);
    }

    if (scenario === 'records'){
      subject = 'Transfer of school records from France';
      lines.push(greeting);
      lines.push('');
      lines.push('I am writing to ask how to transfer school records from France for ' + child + '.');
      lines.push('Could you please tell me where to send transcripts/report cards and whether you need an official translation?');
      lines.push('');
      lines.push('Thank you for your help.');
      lines.push('Kind regards,');
      lines.push(parent);
    }

    if (!subject) subject = 'School question';

    return 'Subject: ' + subject + '' + lines.join('');
  }

  function initGenerator(){
    function readOpts(){
      return {
        scenario: $('genScenario').value,
        state: $('genState').value,
        town: ($('genTown').value || '').trim() || 'your town',
        parent: ($('genParent').value || '').trim(),
        child: ($('genChild').value || '').trim() || 'my child',
        age: ($('genAge').value || '').trim(),
        grade: ($('genGrade').value || '').trim(),
        arrive: ($('genArrive').value || '').trim(),
        extra: ($('genConcern').value || '').trim()
      };
    }

    function setOut(txt){
      $('genOut').textContent = txt;
      $('genCopy').disabled = !txt || txt.indexOf('Subject:') !== 0;
      $('genListen').disabled = !txt || txt.indexOf('Subject:') !== 0;
    }

    function reset(){
      $('genScenario').value = '';
      $('genState').value = 'MA';
      $('genTown').value = '';
      $('genParent').value = '';
      $('genChild').value = '';
      $('genAge').value = '';
      $('genGrade').value = '';
      $('genArrive').value = '';
      $('genConcern').value = '';
      setOut('Choose a scenario and click Generate.');
    }

    $('genBtn').addEventListener('click', function(){
      var opts = readOpts();
      if (!opts.scenario){
        setOut('Choose a scenario first.');
        return;
      }
      var txt = buildMessage(opts);
      setOut(txt);
      setScore(6, 'generator_used');
    });

    $('genReset').addEventListener('click', reset);

    $('genCopy').addEventListener('click', function(){
      var txt = $('genOut').textContent;
      if (!txt) return;
      if (!navigator.clipboard){
        // fallback
        var ta = document.createElement('textarea');
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        try{ document.execCommand('copy'); } catch(e) {}
        document.body.removeChild(ta);
      } else {
        navigator.clipboard.writeText(txt);
      }
      setScore(2, 'generator_copy');
    });

    $('genListen').addEventListener('click', function(){
      speak($('genOut').textContent);
    });

    reset();
  }

  // Generator mini quiz
  var genQuiz = [
    {
      q: 'Choose the best subject line:',
      options: ['Help!!!','Enrollment appointment request','Question'],
      a: 'Enrollment appointment request',
      explain: 'A clear subject helps the office route your email quickly.'
    },
    {
      q: 'Choose the most polite request:',
      options: ['Send me the forms.','Could you please email me the forms?','I want the forms now.'],
      a: 'Could you please email me the forms?',
      explain: 'Could + please is polite and clear.'
    }
  ];

  // ---------------------------
  // Global actions
  // ---------------------------
  function resetAll(){
    if (window.speechSynthesis) { try{ window.speechSynthesis.cancel(); } catch(e){} }
    localStorage.removeItem(LS_KEY_SCORE);
    localStorage.removeItem(LS_KEY_DONE);
    score = 0;
    done = {};
    updateScoreUI();

    // Re-init exercises
    renderMCQ($('politeMcq'), politeMCQ, 'polite_mcq');
    renderMCQ($('timeMcq'), timeMCQ, 'time_mcq');
    renderMCQ($('genMcq'), genQuiz, 'gen_mcq');

    initPoliteBuilder();
    initDateExercise();
    initSchedule();
    initLetterDnD();
    initEmailFill();

    $('dateResult').textContent = '';
    $('genOut').textContent = 'Choose a scenario and click Generate.';
  }

  // ---------------------------
  // Bind UI events
  // ---------------------------
  function bindControls(){
    $('accentUS').addEventListener('click', function(){ setAccent('en-US'); });
    $('accentUK').addEventListener('click', function(){ setAccent('en-GB'); });

    $('helpOff').addEventListener('click', function(){ setHelp(false); });
    $('helpOn').addEventListener('click', function(){ setHelp(true); });

    $('testVoice').addEventListener('click', function(){
      speak('Hello! This is the selected accent. Could you please tell me which documents are required?');
    });

    $('resetAll').addEventListener('click', resetAll);
    $('resetAllTop').addEventListener('click', resetAll);

    $('printBtn').addEventListener('click', function(){ window.print(); });
    $('printBtnTop').addEventListener('click', function(){ window.print(); });

    // Listen buttons
    qa('[data-say]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var key = btn.getAttribute('data-say');
        if (key === 'politeSummary') speak(politeSummary);
        else if (key === 'datesSummary') speak(datesSummary);
        else if (key === 'lettersSummary') speak(lettersSummary);
        else if (key === 'practiceSummary') speak(practiceSummary);
        else speak(key);
      });
    });
  }

  // ---------------------------
  // Init
  // ---------------------------
  function init(){
    loadState();
    updateScoreUI();

    tts.init();
    bindControls();
    setAccent('en-US');
    setHelp(false);

    renderMCQ($('politeMcq'), politeMCQ, 'polite_mcq');
    renderMCQ($('timeMcq'), timeMCQ, 'time_mcq');
    renderMCQ($('genMcq'), genQuiz, 'gen_mcq');

    initPoliteBuilder();
    initDateExercise();
    initSchedule();
    initLetterDnD();
    initEmailFill();
    initGenerator();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
