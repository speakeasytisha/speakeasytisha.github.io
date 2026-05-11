(function(){
  "use strict";

  var LESSONS = [{"session": 1, "duration": "1h", "hoursRemaining": "19", "date": "2025-10-06", "dateDisplay": "06/10/2025", "title": "Introduction / Getting to know each other", "theme": "Introduction", "objective": "A1.2 speaking — take part in a simple conversation and answer very familiar questions.", "content": "Check your goals, method, introductions, getting to know each other.", "tags": ["introduction", "speaking", "goals", "conversation", "presenting yourself"], "resources": [{"label": "Google Slides", "url": "https://docs.google.com/presentation/d/1GRnXlVxDPA_34rw8a29JgTIvmVp_-A7b/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"}]}, {"session": 2, "duration": "1h", "hoursRemaining": "18", "date": "2025-10-14", "dateDisplay": "14/10/2025", "title": "Hotel", "theme": "Hotel", "objective": "A1.2 reading + speaking — understand simple written messages and respond in short exchanges.", "content": "Hotel vocabulary, grammar, dialogue, role-play, exercises and greetings.", "tags": ["hotel", "travel", "vocabulary", "greetings", "dialogue", "roleplay", "grammar"], "resources": [{"label": "Google Slides", "url": "https://docs.google.com/presentation/d/17C1wb_BS5X8vnot5YaAX2_MbRoRYEcbM/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"}]}, {"session": 3, "duration": "1h", "hoursRemaining": "17", "date": "2025-10-20", "dateDisplay": "20/10/2025", "title": "Hotel", "theme": "Hotel", "objective": "A1.2 listening + speaking + reading — understand simple information in everyday situations.", "content": "Schedule, dates, time, present simple, ordinals, vocabulary, dialogue and exercises.", "tags": ["hotel", "travel", "present simple", "dates", "time", "ordinals", "numbers", "vocabulary", "dialogue", "grammar"], "resources": [{"label": "Google Slides", "url": "https://docs.google.com/presentation/d/1XdOs4mBEfqlekmo6iR-KwEJ8IrnYms0Z/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"}]}, {"session": 4, "duration": "1h", "hoursRemaining": "16", "date": "2025-10-27", "dateDisplay": "27/10/2025", "title": "Hotel", "theme": "Hotel", "objective": "A1.2 listening + reading + speaking — manage simple hotel communication.", "content": "Prepositions, imperative, vocabulary, there is / there are, polite words, time, exercises and dialogue.", "tags": ["hotel", "travel", "prepositions", "imperative", "there is/there are", "polite language", "time", "grammar", "dialogue", "vocabulary"], "resources": [{"label": "Google Slides", "url": "https://docs.google.com/presentation/d/1p4oWrxRMb-ZtpVTpi7A8zcCyvgnWr7HN/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"}]}, {"session": 5, "duration": "1h", "hoursRemaining": "15", "date": "2025-11-04", "dateDisplay": "04/11/2025", "title": "Hotel — Room Service / Restaurant", "theme": "Hotel & Restaurant", "objective": "A1.2 listening + speaking — handle simple service situations.", "content": "Room service / restaurant vocabulary, meal stages, recommendations, exercises, dialogues and role-play.", "tags": ["hotel", "restaurant", "room service", "recommendations", "food", "travel", "vocabulary", "dialogue", "roleplay"], "resources": [{"label": "Google Slides", "url": "https://docs.google.com/presentation/d/1A6-RKE2np4ggWV4rbpLOtOJLPP_GXBCC/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"}]}, {"session": 6, "duration": "1h", "hoursRemaining": "14", "date": "2025-11-17", "dateDisplay": "17/11/2025", "title": "Hotel — Getting around", "theme": "Hotel & Travel", "objective": "A2.1 speaking + listening — exchange information about usual situations and immediate needs.", "content": "Review of getting around the hotel, exercises, vocabulary and dialogue.", "tags": ["hotel", "travel", "getting around", "directions", "vocabulary", "dialogue", "review"], "resources": [{"label": "Google Slides", "url": "https://docs.google.com/presentation/d/1A6-RKE2np4ggWV4rbpLOtOJLPP_GXBCC/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"}]}, {"session": 7, "duration": "1h", "hoursRemaining": "13", "date": "2025-11-26", "dateDisplay": "26/11/2025", "title": "Hotel", "theme": "Hotel", "objective": "A1.2 listening + speaking — reinforce simple everyday communication.", "content": "Vocabulary, grammar, dialogue and exercises.", "tags": ["hotel", "travel", "vocabulary", "grammar", "dialogue", "practice"], "resources": [{"label": "Google Slides", "url": "https://docs.google.com/presentation/d/1SACmrzKvrvBZUm70xds4PcdjME_GE9Mz/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"}]}, {"session": 8, "duration": "1h", "hoursRemaining": "12", "date": "2025-12-01", "dateDisplay": "01/12/2025", "title": "Hotel — Write a Review / Letter", "theme": "Writing", "objective": "A1.2 writing + speaking — write short simple notes and communicate in familiar situations.", "content": "Writing a review and an email.", "tags": ["hotel", "writing", "review", "email", "travel", "greetings", "closing"], "resources": [{"label": "Google Slides", "url": "https://docs.google.com/presentation/d/1SACmrzKvrvBZUm70xds4PcdjME_GE9Mz/edit?usp=drive_link&ouid=109556509326335338714&rtpof=true&sd=true"}]}, {"session": 9, "duration": "1h", "hoursRemaining": "11", "date": "2025-12-15", "dateDisplay": "15/12/2025", "title": "Let’s talk", "theme": "Speaking", "objective": "A1.2 speaking + listening — answer open-ended questions in simple exchanges.", "content": "Open-ended questions, possessives, present simple, present continuous and present perfect.", "tags": ["speaking", "open questions", "possessives", "present simple", "present continuous", "present perfect", "verbs", "conversation"], "resources": [{"label": "SpeakEasyTisha page", "url": "https://speakeasytisha.github.io/theme-questions.html"}]}, {"session": 10, "duration": "1h", "hoursRemaining": "10", "date": "2026-01-05", "dateDisplay": "05/01/2026", "title": "Small Talk", "theme": "Small Talk", "objective": "A1.2 speaking — make a very basic presentation of yourself or another person.", "content": "Possessive adjectives, family vocabulary, numbers and ages, dates and years, small talk and a short message.", "tags": ["small talk", "family", "numbers", "ages", "dates", "years", "possessive adjectives", "writing", "speaking"], "resources": [{"label": "SpeakEasyTisha page", "url": "https://speakeasytisha.github.io/eric-family-smalltalk"}]}, {"session": 11, "duration": "1h", "hoursRemaining": "9", "date": "2026-01-12", "dateDisplay": "12/01/2026", "title": "CLOE", "theme": "CLOE Prep", "objective": "Review grammar and vocabulary basics for the exam.", "content": "Overview and practice.", "tags": ["cloe", "exam prep", "grammar", "vocabulary", "review"], "resources": [{"label": "SpeakEasyTisha page", "url": "https://speakeasytisha.github.io/cloe-exam-prep"}]}, {"session": 12, "duration": "1h", "hoursRemaining": "8", "date": "2026-01-26", "dateDisplay": "26/01/2026", "title": "Movies", "theme": "Movies", "objective": "A2.1 speaking + listening + reading — discuss familiar topics in more detail.", "content": "Describe a movie, compare movies with comparatives and superlatives, talk about filmmaking and discuss French vs American cinema.", "tags": ["movies", "comparatives", "superlatives", "connectors", "speaking", "culture", "vocabulary"], "resources": [{"label": "SpeakEasyTisha page", "url": "https://speakeasytisha.github.io/movies-lesson"}]}, {"session": 13, "duration": "1h", "hoursRemaining": "7", "date": "2026-02-09", "dateDisplay": "09/02/2026", "title": "CLOE", "theme": "CLOE Prep", "objective": "Review grammar and vocabulary basics for the exam.", "content": "CLOE prep and review.", "tags": ["cloe", "exam prep", "grammar", "vocabulary", "review"], "resources": [{"label": "CLOE Exam Prep", "url": "https://speakeasytisha.github.io/cloe-exam-prep"}, {"label": "CLOE Prep Course", "url": "https://speakeasytisha.github.io/cloe-prep-course"}]}, {"session": 14, "duration": "1h", "hoursRemaining": "6", "date": "2026-02-16", "dateDisplay": "16/02/2026", "title": "CLOE", "theme": "Future Plans", "objective": "Review grammar and vocabulary basics for the exam.", "content": "When to use each future form; plan a weekend or a trip using will, be going to and the present continuous; vocabulary and quiz.", "tags": ["cloe", "future forms", "will", "going to", "present continuous", "travel", "grammar", "vocabulary"], "resources": [{"label": "Future Plans page", "url": "https://speakeasytisha.github.io/future-plans"}]}, {"session": 15, "duration": "1h", "hoursRemaining": "5", "date": "2026-03-02", "dateDisplay": "02/03/2026", "title": "CLOE Verb Tense Decoder", "theme": "Verb Tenses", "objective": "Review grammar and vocabulary basics for the exam.", "content": "Verb tense decoder, cheat sheet and review.", "tags": ["cloe", "verb tenses", "verbs", "grammar", "cheat sheet", "review"], "resources": [{"label": "Verb Tense Decoder", "url": "https://speakeasytisha.github.io/cloe-tense-cheat-sheet.html"}]}, {"session": 16, "duration": "1h", "hoursRemaining": "4", "date": "2026-03-16", "dateDisplay": "16/03/2026", "title": "CLOE Speaking", "theme": "CLOE Speaking", "objective": "A2.1 speaking — speak about familiar topics with simple connected sentences and gain more fluency.", "content": "Present yourself clearly for the CLOE oral interview: where you live, your job at CARSAT, what you like and places you have visited.", "tags": ["cloe", "speaking", "self-introduction", "work", "prepositions", "travel", "where you live", "likes"], "resources": [{"label": "Self-Intro Masterclass", "url": "https://speakeasytisha.github.io/cloe-frankie-self-intro-masterclass.html"}]}, {"session": 17, "duration": "1h", "hoursRemaining": "3", "date": "2026-03-23", "dateDisplay": "23/03/2026", "title": "Self Introduction", "theme": "Self Introduction", "objective": "A2.1 speaking — talk about familiar topics using simple linked sentences.", "content": "Introduce yourself, expand, close politely, prepositions for location, speaking trainer, paragraph builder, vocabulary flashcards and mini test.", "tags": ["self-introduction", "prepositions", "speaking", "vocabulary", "paragraph building", "mini test", "polite closing"], "resources": [{"label": "Self-Intro Cheat Sheet", "url": "https://speakeasytisha.github.io/cloe-frankie-self-intro-cheat-sheet.html"}, {"label": "Self-Intro Masterclass", "url": "https://speakeasytisha.github.io/cloe-frankie-self-intro-masterclass.html"}]}, {"session": 18, "duration": "1h", "hoursRemaining": "2", "date": "2026-03-30", "dateDisplay": "30/03/2026", "title": "CLOE Writing + Oral Studio", "theme": "CLOE Writing & Oral", "objective": "A2.1 writing — write short messages and simple notes on everyday topics.", "content": "Practice realistic CLOE writing and oral role-plays. Each scenario includes a plan, model text, UK/US listening and guided exercises.", "tags": ["cloe", "writing", "oral", "email", "roleplay", "model answers", "listening", "guided practice"], "resources": [{"label": "Google Doc", "url": "https://docs.google.com/document/d/1h_2ZkXXZk8CQEQ3Vh4tX6K-Ye0t4qYiQ/edit?usp=sharing&ouid=109556509326335338714&rtpof=true&sd=true"}, {"label": "Writing + Oral Studio", "url": "https://speakeasytisha.github.io/cloe-frankie-writing-speaking-studio.html"}]}, {"session": 19, "duration": "1h", "hoursRemaining": "1", "date": "2026-04-15", "dateDisplay": "15/04/2026", "title": "Preparation au test", "theme": "Final Test Prep", "objective": "Final preparation for the CLOE test.", "content": "Final review and preparation before the scheduled test on 30/04/2026.", "tags": ["cloe", "test prep", "final review", "exam"], "resources": []}];
  var FILTER_GROUPS = {"Theme": ["introduction", "hotel", "restaurant", "travel", "small talk", "movies", "self-introduction", "cloe", "writing", "speaking"], "Grammar & language": ["present simple", "present continuous", "present perfect", "future forms", "will", "going to", "verbs", "verb tenses", "prepositions", "there is/there are", "imperative", "possessive adjectives", "possessives", "comparatives", "superlatives", "ordinals", "numbers", "dates", "time"], "Skills & functions": ["vocabulary", "dialogue", "roleplay", "email", "review", "open questions", "family", "greetings", "closing", "polite language", "conversation", "listening", "guided practice", "model answers", "paragraph building", "mini test", "exam prep", "test prep"]};
  var LS_KEY = 'se_frankie_history_filters_v1';

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
    });
  }

  var state = loadState();
  function loadState(){
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : { search:'', sort:'dateAsc', tags:[] };
    } catch(e) {
      return { search:'', sort:'dateAsc', tags:[] };
    }
  }
  function saveState(){ try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch(e){} }

  function formatTagLabel(tag){
    return tag.split('/').map(function(part){
      return part.split(' ').map(function(word){
        return word ? word.charAt(0).toUpperCase() + word.slice(1) : word;
      }).join(' ');
    }).join(' / ');
  }

  function renderFilters(){
    var wrap = $('#filterGroups');
    wrap.innerHTML = '';
    Object.keys(FILTER_GROUPS).forEach(function(groupName){
      var section = document.createElement('section');
      section.className = 'filter-group';
      section.innerHTML = '<h3>' + esc(groupName) + '</h3><div class="filter-chips"></div>';
      var chipWrap = $('.filter-chips', section);
      FILTER_GROUPS[groupName].forEach(function(tag){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-chip' + (state.tags.indexOf(tag) !== -1 ? ' active' : '');
        btn.textContent = formatTagLabel(tag);
        btn.dataset.tag = tag;
        btn.addEventListener('click', function(){
          var idx = state.tags.indexOf(tag);
          if(idx === -1) state.tags.push(tag); else state.tags.splice(idx,1);
          saveState();
          renderAll();
        });
        chipWrap.appendChild(btn);
      });
      wrap.appendChild(section);
    });
  }

  function sortLessons(items){
    var list = items.slice();
    var mode = state.sort || 'dateAsc';
    list.sort(function(a,b){
      if(mode === 'dateAsc') return a.date.localeCompare(b.date);
      if(mode === 'dateDesc') return b.date.localeCompare(a.date);
      if(mode === 'sessionAsc') return a.session - b.session;
      if(mode === 'sessionDesc') return b.session - a.session;
      if(mode === 'titleAsc') return a.title.localeCompare(b.title);
      return 0;
    });
    return list;
  }

  function filterLessons(){
    var q = (state.search || '').trim().toLowerCase();
    var tags = state.tags || [];
    return sortLessons(LESSONS.filter(function(item){
      var hay = [item.title, item.theme, item.objective, item.content, item.dateDisplay, item.duration, item.hoursRemaining].concat(item.tags).join(' | ').toLowerCase();
      var searchOk = !q || hay.indexOf(q) !== -1;
      var tagsOk = !tags.length || tags.some(function(tag){ return item.tags.indexOf(tag) !== -1; });
      return searchOk && tagsOk;
    }));
  }

  function renderLessons(items){
    var wrap = $('#lessonList');
    wrap.innerHTML = '';
    if(!items.length){
      wrap.innerHTML = '<div class="empty-state">No lessons match your current filters. Try clearing filters or using a different search.</div>';
      return;
    }

    items.forEach(function(item){
      var details = document.createElement('details');
      details.className = 'lesson';
      details.innerHTML = ''
        + '<summary>'
        +   '<div class="lesson__left">'
        +     '<div class="lesson__number">' + item.session + '</div>'
        +     '<div>'
        +       '<div class="lesson__title">' + esc(item.title) + '</div>'
        +       '<div class="lesson__subtitle">' + esc(item.theme) + '</div>'
        +       '<div class="lesson__meta">'
        +         '<span class="meta-pill">📅 ' + esc(item.dateDisplay) + '</span>'
        +         '<span class="meta-pill">⏱ ' + esc(item.duration) + '</span>'
        +         '<span class="meta-pill">🕒 Hours remaining: ' + esc(item.hoursRemaining) + '</span>'
        +       '</div>'
        +     '</div>'
        +   '</div>'
        +   '<div class="lesson__arrow">⌄</div>'
        + '</summary>'
        + '<div class="lesson__body">'
        +   '<div class="lesson-grid">'
        +     '<div class="info-box"><div class="info-box__title">🎯 Main objective</div><p>' + esc(item.objective) + '</p></div>'
        +     '<div class="info-box"><div class="info-box__title">🧩 What you worked on</div><p>' + esc(item.content) + '</p></div>'
        +   '</div>'
        +   '<div class="lesson-grid">'
        +     '<div class="info-box"><div class="info-box__title">🏷 Categories</div><div class="tag-bank">' + item.tags.map(function(tag){ return '<span class="tag">' + esc(formatTagLabel(tag)) + '</span>'; }).join('') + '</div></div>'
        +     '<div class="info-box"><div class="info-box__title">🔗 Resource links</div><div class="resources">' + (item.resources.length ? item.resources.map(function(r){ return '<a class="resource-link" href="' + esc(r.url) + '" target="_blank" rel="noopener">↗ ' + esc(r.label) + '</a>'; }).join('') : '<span class="muted">No specific resource link recorded for this session.</span>') + '</div></div>'
        +   '</div>'
        + '</div>';
      wrap.appendChild(details);
    });
  }

  function updateOverview(items){
    $('#shownCount').textContent = String(items.length);
    $('#activeTagCount').textContent = String((state.tags || []).length);
    $('#resultsInfo').textContent = items.length === 1 ? '1 lesson found.' : items.length + ' lessons found.';
  }

  function renderAll(){
    $('#searchInput').value = state.search || '';
    $('#sortSelect').value = state.sort || 'dateAsc';
    renderFilters();
    var filtered = filterLessons();
    renderLessons(filtered);
    updateOverview(filtered);
  }

  $('#searchInput').addEventListener('input', function(){
    state.search = this.value;
    saveState();
    renderAll();
  });

  $('#sortSelect').addEventListener('change', function(){
    state.sort = this.value;
    saveState();
    renderAll();
  });

  $('#btnClearFilters').addEventListener('click', function(){
    state = { search:'', sort:'dateAsc', tags:[] };
    saveState();
    renderAll();
  });

  $('#btnPrint').addEventListener('click', function(){ window.print(); });

  $('#btnOpenAll').addEventListener('click', function(){ $all('.lesson').forEach(function(d){ d.open = true; }); });
  $('#btnCloseAll').addEventListener('click', function(){ $all('.lesson').forEach(function(d){ d.open = false; }); });

  $all('[data-scroll]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = $(btn.getAttribute('data-scroll'));
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  renderAll();
})();