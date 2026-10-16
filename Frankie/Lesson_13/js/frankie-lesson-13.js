(function(){
  'use strict';

  var jsWarning = document.getElementById('jsWarning');
  if (jsWarning) jsWarning.classList.add('hidden');

  /* =========================================================
     1. UTILITIES
     ========================================================= */
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
    });
  }
  function shuffle(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  // Shuffle but make sure the correct answer is not always in first position
  function shuffleOptions(options, answer){
    var a = shuffle(options);
    if (a.length > 1 && a[0] === answer && Math.random() < 0.7){
      var k = 1 + Math.floor(Math.random() * (a.length - 1));
      var t = a[0]; a[0] = a[k]; a[k] = t;
    }
    return a;
  }

  var CONTRACTIONS = [
    ["doesn't","does not"],["don't","do not"],["didn't","did not"],["isn't","is not"],["aren't","are not"],
    ["wasn't","was not"],["weren't","were not"],["won't","will not"],["haven't","have not"],["hasn't","has not"],
    ["can't","cannot"],["i'm","i am"],["you're","you are"],["we're","we are"],["they're","they are"],
    ["i've","i have"],["you've","you have"],["we've","we have"],["they've","they have"],
    ["i'll","i will"],["you'll","you will"],["he'll","he will"],["she'll","she will"],["it'll","it will"],["we'll","we will"],["they'll","they will"]
  ];
  function baseNorm(text){
    var s = String(text || '').toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[,;:"]/g, ' ')
      .replace(/[.!?]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    CONTRACTIONS.forEach(function(p){
      s = s.replace(new RegExp("\\b" + p[0].replace("'", "'") + "\\b", 'g'), p[1]);
    });
    s = s.replace(/\bcan not\b/g, 'cannot');
    s = s.replace(/^'s\b/, 'is').replace(/^'m\b/, 'am').replace(/^'re\b/, 'are').replace(/^'ll\b/, 'will').replace(/^'ve\b/, 'have');
    return s;
  }
  function variants(text){
    var s = baseNorm(text);
    var out = [s];
    var re = /\b(he|she|it|there|that|what|where|who)'s\b/g;
    if (re.test(s)){
      out.push(s.replace(re, '$1 is'));
      out.push(s.replace(re, '$1 has'));
    }
    return out;
  }
  function matches(user, accepted){
    var u = variants(user);
    var list = String(accepted).split('|');
    for (var i = 0; i < list.length; i++){
      var v = variants(list[i]);
      for (var j = 0; j < u.length; j++){
        if (v.indexOf(u[j]) !== -1) return true;
      }
    }
    return false;
  }

  /* =========================================================
     2. SPEECH
     ========================================================= */
  var chosenVoice = 'en-US';
  var synth = window.speechSynthesis;
  var voicesCache = [];
  function loadVoices(){ if (synth && synth.getVoices) voicesCache = synth.getVoices(); }
  loadVoices();
  if (synth && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;

  function pickVoice(){
    if (!voicesCache.length) loadVoices();
    var exact = voicesCache.filter(function(v){ return v.lang && v.lang.replace('_','-').toLowerCase() === chosenVoice.toLowerCase(); });
    if (exact.length){
      var named = exact.filter(function(v){ return /samantha|google|daniel|serena|karen|natural|premium|enhanced/i.test(v.name); });
      return named[0] || exact[0];
    }
    var en = voicesCache.filter(function(v){ return v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
    return en[0] || null;
  }
  function speak(text, rate){
    if (!text || !synth) return;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(String(text).replace(/_{2,}/g, 'blank'));
    u.lang = chosenVoice; // keeps iOS from switching to a French voice
    u.rate = rate || 0.85;
    var v = pickVoice();
    if (v) u.voice = v;
    synth.speak(u);
  }

  document.addEventListener('click', function(e){
    var sayBtn = e.target.closest('[data-say]');
    if (sayBtn){ speak(sayBtn.getAttribute('data-say'), sayBtn.getAttribute('data-rate') ? parseFloat(sayBtn.getAttribute('data-rate')) : undefined); }
    var scrollBtn = e.target.closest('[data-scroll]');
    if (scrollBtn){
      var target = $(scrollBtn.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });

  $all('.voice-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      chosenVoice = btn.getAttribute('data-voice') || 'en-US';
      $all('.voice-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
  var stopBtn = $('#stopVoice');
  if (stopBtn) stopBtn.addEventListener('click', function(){ if (synth) synth.cancel(); });
  var printBtn = $('#printBtn');
  if (printBtn) printBtn.addEventListener('click', function(){ window.print(); });

  var frBtn = $('#toggleFr');
  if (frBtn) frBtn.addEventListener('click', function(){
    var hidden = document.body.classList.toggle('hide-fr');
    frBtn.classList.toggle('active', !hidden);
    frBtn.textContent = hidden ? '🇫🇷 French: OFF' : '🇫🇷 French: ON';
  });

  /* Tabs */
  $all('.tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      $all('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      $all('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.getElementById(btn.getAttribute('data-tab'));
      if (panel) panel.classList.add('active');
    });
  });

  /* =========================================================
     3. WARM-UP
     ========================================================= */
  var warmup = [
    'How does it feel to be back home?',
    'What do you miss about the trip?',
    'What is the first thing you did when you came back?',
    'What does a normal day look like for you now?',
    'What are you doing this week?',
    'What are you going to do next weekend?'
  ];
  var warmupList = $('#warmupList');
  if (warmupList){
    warmupList.innerHTML = warmup.map(function(q){
      return '<li>' + esc(q) + ' <button class="say-mini" type="button" data-say="' + esc(q) + '" aria-label="Listen">🔊</button></li>';
    }).join('');
  }

  /* =========================================================
     4. VOCABULARY
     ========================================================= */
  var vocab = [
    ['Home & rooms','🏡','house / flat','maison / appartement','The place where you live.','I live in a house near the sea.'],
    ['Home & rooms','🛋️','living room','salon','The room where you relax.','We watch TV in the living room.'],
    ['Home & rooms','🍳','kitchen','cuisine','The room where you cook.','My kitchen is small but bright.'],
    ['Home & rooms','🛏️','bedroom','chambre','The room where you sleep.','There are three bedrooms upstairs.'],
    ['Home & rooms','🚿','bathroom','salle de bains','The room with a shower or a bath.','The bathroom is next to my bedroom.'],
    ['Home & rooms','🌿','garden','jardin','An outside space with plants.','I love having breakfast in the garden.'],
    ['Home & rooms','🚗','driveway / garage','allée / garage','A place to park your car or campervan.','The campervan is in the driveway now.'],
    ['Home & rooms','🏘️','neighbourhood','quartier','The area around your home.','My neighbourhood is quiet and friendly.'],

    ['Daily routine','⏰','wake up','se réveiller','Stop sleeping.','I usually wake up at 6:30.'],
    ['Daily routine','🛁','have a shower','prendre une douche','Wash your body under water.','She has a shower every morning.'],
    ['Daily routine','☕','have breakfast','prendre le petit-déjeuner','Eat the first meal of the day.','We have breakfast at 7:15.'],
    ['Daily routine','🚙','commute','faire le trajet domicile-travail','Travel to work and back.','My commute takes twenty minutes.'],
    ['Daily routine','🍽️','have lunch / dinner','déjeuner / dîner','Eat in the middle of the day / in the evening.','We have dinner at about 8 pm.'],
    ['Daily routine','📺','relax','se détendre','Rest and feel calm.','In the evening, I relax on the sofa.'],
    ['Daily routine','😴','go to bed','aller se coucher','Go to sleep.','He goes to bed at 11.'],

    ['Housework & garden','🧺','do the laundry','faire la lessive','Wash clothes.','I did the laundry after the trip.'],
    ['Housework & garden','🧽','do the washing-up','faire la vaisselle','Wash the dishes.','My son does the washing-up.'],
    ['Housework & garden','🧹','clean the house','faire le ménage','Make the house clean.','We clean the house on Saturdays.'],
    ['Housework & garden','🛒','do the shopping','faire les courses','Buy food and things you need.','She does the shopping on Friday evening.'],
    ['Housework & garden','🌱','water the plants','arroser les plantes','Give water to plants.','My neighbour watered the plants while we were away.'],
    ['Housework & garden','✂️','mow the lawn','tondre la pelouse','Cut the grass.','He mows the lawn every two weeks.'],

    ['Family & people','👨‍👩‍👧','family','famille','Your parents, children, brothers, sisters…','My family is very important to me.'],
    ['Family & people','👦','son / daughter','fils / fille','Your child (boy / girl).','My daughter lives in another town.'],
    ['Family & people','👵','grandparents','grands-parents','Your parents’ parents.','My grandparents lived on a farm.'],
    ['Family & people','🧑‍🤝‍🧑','neighbour','voisin(e)','A person who lives near you.','Our neighbour is very kind.'],
    ['Family & people','👭','close friend','ami(e) proche','A friend you trust a lot.','I have a close friend in Nantes.'],
    ['Family & people','🐶','pet','animal de compagnie','An animal that lives with you.','Do you have a pet?'],
    ['Family & people','🤝','get on well with','bien s’entendre avec','Have a good relationship.','I get on well with my neighbours.'],

    ['Weekend & free time','🚶','go for a walk','aller se promener','Walk for pleasure.','We go for a walk on the beach on Sundays.'],
    ['Weekend & free time','🛍️','go to the market','aller au marché','Visit the local market.','She goes to the market on Saturday morning.'],
    ['Weekend & free time','📖','read a book','lire un livre','Spend time reading.','I am reading a good book at the moment.'],
    ['Weekend & free time','🚴','go cycling','faire du vélo','Ride a bike.','They went cycling last weekend.'],
    ['Weekend & free time','🎬','watch a film','regarder un film','Watch a movie.','We watched a film on Friday night.'],
    ['Weekend & free time','🍷','invite friends over','inviter des amis','Ask friends to come to your home.','We are going to invite friends over next Saturday.'],
    ['Weekend & free time','🧘','take it easy','se la couler douce','Relax, do nothing stressful.','On Sundays, I take it easy.'],

    ['Feelings','😊','happy / glad','heureux(-se) / content(e)','Feeling good.','I am glad to be back home.'],
    ['Feelings','😴','tired','fatigué(e)','You need to rest.','I was tired after the long drive.'],
    ['Feelings','😌','relaxed','détendu(e)','Calm, with no stress.','I feel relaxed after the holidays.'],
    ['Feelings','🥲','nostalgic','nostalgique','Missing a good moment from the past.','I feel a bit nostalgic about the trip.'],
    ['Feelings','💪','motivated','motivé(e)','You want to do things.','I am motivated to keep learning English.'],
    ['Feelings','😮‍💨','busy','occupé(e) / débordé(e)','With a lot of things to do.','This week is very busy.'],
    ['Feelings','🙂','proud','fier / fière','Happy about something you did.','I am proud of my progress.'],

    ['Everyday work','🏢','office','bureau','The place where you work.','I work in an office.'],
    ['Everyday work','👥','colleague','collègue','A person you work with.','I have lunch with a colleague.'],
    ['Everyday work','📄','file / document','dossier / document','Papers or information to process.','I process a lot of files every day.'],
    ['Everyday work','📧','email','e-mail / courriel','A message on the computer.','She answers emails in the morning.'],
    ['Everyday work','📞','phone call','appel téléphonique','A conversation on the phone.','I make a lot of phone calls.'],
    ['Everyday work','🗓️','meeting','réunion','When people meet to discuss.','We have a meeting on Monday.'],
    ['Everyday work','⏱️','part-time / full-time','temps partiel / temps plein','How many hours you work.','Do you work full-time?'],

    ['Time & frequency','🔁','always / usually / often','toujours / d’habitude / souvent','How often you do something.','I usually get up early.'],
    ['Time & frequency','🔂','sometimes / rarely / never','parfois / rarement / jamais','How often you do something.','She never works on Sundays.'],
    ['Time & frequency','📅','every day / once a week','tous les jours / une fois par semaine','Frequency expressions.','I go swimming once a week.'],
    ['Time & frequency','⏳','at the moment / these days','en ce moment / ces temps-ci','Around now (temporary).','These days, I am very busy.'],
    ['Time & frequency','⏪','ago','il y a','Before now (past).','I came back two weeks ago.'],
    ['Time & frequency','⏩','next / soon','prochain / bientôt','In the future.','I am going to travel again soon.']
  ];

  function vocabCardHtml(item){
    return '<article class="vocab-card">'
      + '<div class="vocab-head"><span class="vocab-icon">' + item[1] + '</span><div><div class="cat-label">' + esc(item[0]) + '</div><h3>' + esc(item[2]) + '</h3><span class="tag-fr fr">' + esc(item[3]) + '</span></div></div>'
      + '<p><strong>Meaning:</strong> ' + esc(item[4]) + '</p>'
      + '<p><strong>Example:</strong> ' + esc(item[5]) + '</p>'
      + '<button class="listen-btn compact" type="button" data-say="' + esc(item[2] + '. ' + item[5]) + '">▶ Listen</button>'
      + '</article>';
  }

  function setupCategoryGrid(data, selectId, gridId, searchId){
    var select = document.getElementById(selectId);
    var grid = document.getElementById(gridId);
    var search = searchId ? document.getElementById(searchId) : null;
    if (!select || !grid) return;
    var cats = ['All categories'];
    data.forEach(function(v){ if (cats.indexOf(v[0]) === -1) cats.push(v[0]); });
    select.innerHTML = cats.map(function(c){ return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    function render(){
      var cat = select.value;
      var q = search ? search.value.toLowerCase().trim() : '';
      var list = data.filter(function(v){
        var okCat = cat === 'All categories' || v[0] === cat;
        var okSearch = !q || v.join(' ').toLowerCase().indexOf(q) !== -1;
        return okCat && okSearch;
      });
      grid.innerHTML = list.map(vocabCardHtml).join('') || '<p class="muted">Nothing found. Try another word.</p>';
    }
    select.addEventListener('change', render);
    if (search) search.addEventListener('input', render);
    render();
  }
  setupCategoryGrid(vocab, 'vocabCategory', 'vocabGrid', 'vocabSearch');

  /* =========================================================
     5. PHRASAL VERBS DATA
     ========================================================= */
  var phrasal = [
    ['Daily routine','⏰','wake up','se réveiller','Stop sleeping.','I wake up at 6:30 on weekdays.'],
    ['Daily routine','🛏️','get up','se lever','Leave your bed.','She gets up at 7 o’clock.'],
    ['Daily routine','👕','put on','mettre (un vêtement)','Start wearing clothes.','Put on your coat, it’s cold!'],
    ['Daily routine','🧥','take off','enlever','Remove clothes or shoes.','I take off my shoes at home.'],
    ['Daily routine','💡','turn on / turn off','allumer / éteindre','Start / stop a machine or light.','Can you turn off the TV, please?'],
    ['Daily routine','🚪','go out','sortir','Leave home for fun.','We go out on Friday evenings.'],

    ['Home & chores','🧹','tidy up','ranger','Make a place neat.','I tidied up the campervan after the trip.'],
    ['Home & chores','📦','put away','ranger (à sa place)','Put something in its usual place.','She put away the camping chairs.'],
    ['Home & chores','🗑️','throw away','jeter','Put in the bin.','We threw away the old maps.'],
    ['Home & chores','🍽️','wash up','faire la vaisselle','Wash the dishes (British).','He washes up after dinner.'],
    ['Home & chores','🧩','sort out','trier / régler','Organise or solve something.','I’m sorting out the holiday photos.'],
    ['Home & chores','🧼','clean up','nettoyer','Make something clean after a mess.','Let’s clean up the kitchen.'],

    ['Back from a trip','🏠','come back / get back','revenir / rentrer','Return home.','We came back two weeks ago.'],
    ['Back from a trip','🔄','settle back in','se réinstaller / reprendre ses marques','Feel normal at home again.','I’m settling back in slowly.'],
    ['Back from a trip','🚐','drop off','déposer','Take someone/something to a place and leave.','I dropped off the keys at the rental agency.'],
    ['Back from a trip','🙋','pick up','aller chercher / récupérer','Go and collect someone or something.','She picked up her mail at the post office.'],
    ['Back from a trip','🤩','look forward to','avoir hâte de','Be excited about the future.','I’m looking forward to the next trip.'],
    ['Back from a trip','🔋','run out of','ne plus avoir de','Have no more of something.','We ran out of water on the last day.'],

    ['Family & friends','👶','look after','s’occuper de','Take care of someone.','She looks after her grandchildren on Wednesdays.'],
    ['Family & friends','🤝','get on (well) with','bien s’entendre avec','Have a good relationship.','I get on well with my sister.'],
    ['Family & friends','☕','catch up with','prendre des nouvelles / rattraper','Talk and share news after some time.','I’m going to catch up with my friends this weekend.'],
    ['Family & friends','🌱','grow up','grandir','Become an adult.','I grew up in a small village.'],
    ['Family & friends','📞','call back','rappeler','Phone someone again.','Can I call you back later?'],
    ['Family & friends','🧑‍🤝‍🧑','hang out (with)','traîner / passer du temps avec','Spend free time together (informal).','My son hangs out with his friends at the weekend.'],

    ['Communication & organisation','🔎','look for','chercher','Try to find.','I’m looking for my glasses.'],
    ['Communication & organisation','💡','find out','découvrir / apprendre','Get information.','I found out that the museum was closed.'],
    ['Communication & organisation','📝','fill in','remplir (un formulaire)','Write information in a form.','Please fill in this form.'],
    ['Communication & organisation','📅','set up','organiser / installer','Organise or prepare something.','Can we set up a meeting on Monday?'],
    ['Communication & organisation','➡️','carry on','continuer','Continue.','Carry on, I’m listening!'],
    ['Communication & organisation','✋','give up','abandonner / arrêter','Stop trying.','Don’t give up, you are making great progress!'],

    ['Feelings & calm','😮‍💨','calm down','se calmer','Become calm.','Take a deep breath and calm down.'],
    ['Feelings & calm','🌞','cheer up','remonter le moral','Become happier / make someone happier.','This sunny day cheers me up.'],
    ['Feelings & calm','🐢','slow down','ralentir','Go slower.','On holiday, I learned to slow down.'],
    ['Feelings & calm','🛋️','chill out','se détendre (familier)','Relax (informal).','On Sunday, I just chill out at home.']
  ];
  setupCategoryGrid(phrasal, 'pvCategory', 'pvGrid');

  /* =========================================================
     6. EXERCISE DATA
     Types: select (1+ blanks), input, transform, mcq, tiles
     ========================================================= */
  var EX = {
    P0: {
      title: '🧭 Exercise 0 · Which pronoun?',
      intro: 'Replace the words with the correct pronoun.',
      fr: 'Remplacez par le bon pronom.',
      type: 'select',
      items: [
        {t:'my son → ___', o:['he','she','it','they'], a:'he', h:'One boy / man.'},
        {t:'my daughter → ___', o:['he','she','it','they'], a:'she', h:'One girl / woman.'},
        {t:'the campervan → ___', o:['he','she','it','they'], a:'it', h:'A thing.'},
        {t:'my children → ___', o:['he','she','it','they'], a:'they', h:'More than one person.'},
        {t:'my husband and I → ___', o:['we','they','he','you'], a:'we', h:'“I” is in the group → we.'},
        {t:'the weather → ___', o:['he','she','it','they'], a:'it', h:'A thing / idea.'},
        {t:'my neighbour Paul → ___', o:['he','she','it','they'], a:'he', h:'Paul is a man.'},
        {t:'my parents → ___', o:['he','she','it','they'], a:'they', h:'Two people.'},
        {t:'the garden → ___', o:['he','she','it','they'], a:'it', h:'A place / thing.'},
        {t:'my friend Sophie → ___', o:['he','she','it','we'], a:'she', h:'Sophie is a woman.'},
        {t:'my friends and I → ___', o:['we','they','you','she'], a:'we', h:'“I” is in the group.'},
        {t:'the shops → ___', o:['it','they','she','we'], a:'they', h:'Plural things → they.'}
      ]
    },

    /* ---------- PRESENT SIMPLE ---------- */
    A1: {
      title: '➕ Exercise A1 · Affirmative: choose the correct verb',
      intro: 'Look at the subject first. He / she / it → verb + s.',
      fr: 'Regardez le sujet. He / she / it → verbe + s.',
      type: 'select',
      items: [
        {c:'I', t:'I ___ at 7 o’clock on weekdays.', o:['get up','gets up'], a:'get up', h:'I → no -s.'},
        {c:'she', t:'My daughter ___ in Nantes.', o:['live','lives'], a:'lives', h:'My daughter = she → -s.'},
        {c:'we', t:'We ___ breakfast together on Sundays.', o:['have','has'], a:'have', h:'We → have.'},
        {c:'he', t:'My neighbour ___ a big garden.', o:['have','has','haves'], a:'has', h:'he / she / it → has (irregular).'},
        {c:'she', t:'She ___ to the market every Saturday.', o:['go','goes','gos'], a:'goes', h:'go → goes.'},
        {c:'they', t:'My children ___ TV in the evening.', o:['watch','watches'], a:'watch', h:'My children = they → no -s.'},
        {c:'it', t:'The dog ___ in the garden.', o:['sleep','sleeps'], a:'sleeps', h:'The dog = it → -s.'},
        {c:'she', t:'My sister ___ yoga on Wednesdays.', o:['do','does','dos'], a:'does', h:'do → does.'},
        {c:'you', t:'You ___ walking by the sea.', o:['like','likes'], a:'like', h:'You → no -s.'},
        {c:'he', t:'My son ___ in Rennes.', o:['study','studys','studies'], a:'studies', h:'consonant + y → ies.'},
        {c:'it', t:'It ___ a lot in November.', o:['rain','rains'], a:'rains', h:'It → -s.'},
        {c:'he', t:'My friend ___ his car every month.', o:['wash','washs','washes'], a:'washes', h:'-sh → -es.'},
        {c:'it', t:'My family ___ near the sea.', o:['live','lives'], a:'lives', h:'My family = one group → -s.'},
        {c:'they', t:'My parents ___ in a small village.', o:['live','lives'], a:'live', h:'My parents = they.'}
      ]
    },
    A2: {
      title: '✏️ Exercise A2 · Spelling: write the he/she/it form',
      intro: 'Write the verb in the present simple. Press Enter or ✓ to check.',
      fr: 'Écrivez le verbe au présent simple. Appuyez sur Entrée ou ✓.',
      type: 'input',
      items: [
        {c:'watch', t:'She ___ the news every evening.', a:'watches', h:'-ch → -es'},
        {c:'fix', t:'He ___ everything in the house.', a:'fixes', h:'-x → -es'},
        {c:'play', t:'My son ___ football on Sundays.', a:'plays', h:'vowel + y → just -s'},
        {c:'try', t:'She ___ new recipes at the weekend.', a:'tries', h:'consonant + y → -ies'},
        {c:'go', t:'He ___ to bed late.', a:'goes', h:'go → goes'},
        {c:'have', t:'My daughter ___ two cats.', a:'has', h:'have → has'},
        {c:'do', t:'She ___ the shopping on Fridays.', a:'does', h:'do → does'},
        {c:'miss', t:'He ___ the trip a lot.', a:'misses', h:'-ss → -es'},
        {c:'finish', t:'My husband ___ work at 5.', a:'finishes', h:'-sh → -es'},
        {c:'enjoy', t:'The dog ___ long walks.', a:'enjoys', h:'vowel + y → -s'}
      ]
    },
    A3: {
      title: '➖ Exercise A3 · Negative: don’t or doesn’t?',
      intro: 'Choose the complete correct form. Remember: after doesn’t, the verb has NO -s.',
      fr: 'Après doesn’t, le verbe n’a pas de -s.',
      type: 'select',
      items: [
        {c:'he', t:'My son ___ with me.', o:["doesn't live","doesn't lives","don't live"], a:"doesn't live", h:'he → doesn’t + base verb.'},
        {c:'I', t:'I ___ on Sundays.', o:["don't work","doesn't work","don't works"], a:"don't work", h:'I → don’t.'},
        {c:'she', t:'She ___ coffee.', o:["don't drink","doesn't drink","doesn't drinks"], a:"doesn't drink", h:'she → doesn’t + base.'},
        {c:'they', t:'My neighbours ___ a car.', o:["don't have","doesn't have","don't has"], a:"don't have", h:'they → don’t have.'},
        {c:'it', t:'It ___ much in summer.', o:["doesn't rain","don't rain","doesn't rains"], a:"doesn't rain", h:'it → doesn’t.'},
        {c:'we', t:'We ___ TV in the morning.', o:["don't watch","doesn't watch","don't watches"], a:"don't watch", h:'we → don’t.'},
        {c:'he', t:'My husband ___ to bed early.', o:["doesn't go","doesn't goes","don't go"], a:"doesn't go", h:'he → doesn’t go.'},
        {c:'you', t:'You ___ in a big city.', o:["don't live","doesn't live","don't lives"], a:"don't live", h:'you → don’t.'},
        {c:'she', t:'My daughter ___ a garden.', o:["doesn't have","doesn't has","don't have"], a:"doesn't have", h:'doesn’t + have (never “has”).'},
        {c:'it', t:'The shop ___ on Mondays.', o:["doesn't open","doesn't opens","don't open"], a:"doesn't open", h:'The shop = it.'}
      ]
    },
    A4: {
      title: '❓ Exercise A4 · Questions and short answers',
      intro: 'Choose Do or Does, then the verb. For short answers, repeat do / does.',
      fr: 'Do ou Does, puis le verbe à la base. Réponse courte : Yes, she does.',
      type: 'select',
      items: [
        {t:'___ your daughter ___ on Saturdays?', blanks:[{o:['Do','Does'],a:'Does'},{o:['work','works'],a:'work'}], h:'your daughter = she → Does + base verb.'},
        {t:'___ you ___ the sea or the mountains?', blanks:[{o:['Do','Does'],a:'Do'},{o:['prefer','prefers'],a:'prefer'}], h:'you → Do.'},
        {t:'___ your son ___ near you?', blanks:[{o:['Do','Does'],a:'Does'},{o:['live','lives'],a:'live'}], h:'your son = he → Does.'},
        {t:'___ your children ___ a lot?', blanks:[{o:['Do','Does'],a:'Do'},{o:['travel','travels'],a:'travel'}], h:'your children = they → Do.'},
        {t:'___ it ___ a lot in your town?', blanks:[{o:['Do','Does'],a:'Does'},{o:['rain','rains'],a:'rain'}], h:'it → Does.'},
        {t:'Where ___ your sister ___?', blanks:[{o:['do','does'],a:'does'},{o:['live','lives'],a:'live'}], h:'Question word + does + she + base verb.'},
        {t:'What time ___ you usually ___ up?', blanks:[{o:['do','does'],a:'do'},{o:['get','gets'],a:'get'}], h:'you → do.'},
        {t:'Does your son live near you? — Yes, he ___.', o:['does','do','lives'], a:'does', h:'Short answer: Yes, he does.'},
        {t:'Do you like campsites? — Yes, I ___.', o:['do','does','like'], a:'do', h:'Short answer: Yes, I do.'},
        {t:'Does your husband cook? — No, he ___.', o:["doesn't","don't","isn't"], a:"doesn't", h:'Short answer: No, he doesn’t.'}
      ]
    },
    A5: {
      title: '🔁 Exercise A5 · Transform: + → − and ?',
      intro: 'Write the negative and the question. Contractions (doesn’t) and full forms (does not) are both accepted.',
      fr: 'Écrivez la phrase négative et la question.',
      type: 'transform',
      items: [
        {t:'She works on Saturdays.', n:"She doesn't work on Saturdays", q:'Does she work on Saturdays', h:'she → doesn’t work / Does she work…?'},
        {t:'He has a big garden.', n:"He doesn't have a big garden", q:'Does he have a big garden', h:'has → doesn’t HAVE / Does he HAVE…?'},
        {t:'They live near the sea.', n:"They don't live near the sea", q:'Do they live near the sea', h:'they → don’t / Do.'},
        {t:'It rains a lot in winter.', n:"It doesn't rain a lot in winter", q:'Does it rain a lot in winter', h:'it → doesn’t / Does.'},
        {t:'You like campsites.', n:"You don't like campsites", q:'Do you like campsites', h:'you → don’t / Do.'},
        {t:'My neighbour goes to the market.', n:"My neighbour doesn't go to the market|My neighbor doesn't go to the market", q:'Does my neighbour go to the market|Does my neighbor go to the market', h:'goes → doesn’t GO / Does … GO?'}
      ]
    },
    A6: {
      title: '🕵️ Exercise A6 · Error hunter: which sentence is correct?',
      intro: 'Click the correct sentence. If you are wrong, try again.',
      fr: 'Cliquez sur la phrase correcte.',
      type: 'mcq',
      items: [
        {q:'Talking about your daughter:', o:['She works in a shop.','She work in a shop.','She is work in a shop.'], a:'She works in a shop.', h:'she + verb-s.'},
        {q:'Negative:', o:["He doesn't like fish.","He don't like fish.","He doesn't likes fish."], a:"He doesn't like fish.", h:'doesn’t + base verb.'},
        {q:'Question:', o:['Does she live in Nantes?','Does she lives in Nantes?','Do she live in Nantes?'], a:'Does she live in Nantes?', h:'Does + she + base verb.'},
        {q:'Your town:', o:['It has a nice market.','It have a nice market.','It haves a nice market.'], a:'It has a nice market.', h:'it → has.'},
        {q:'Your children:', o:['My children live far away.','My children lives far away.','My children is living far away.'], a:'My children live far away.', h:'children = they → no -s.'},
        {q:'Frequency:', o:['She usually goes to bed at 11.','She goes usually to bed at 11.','Usually she go to bed at 11.'], a:'She usually goes to bed at 11.', h:'Frequency words go before the main verb.'}
      ]
    },

    /* ---------- PRESENT CONTINUOUS ---------- */
    B1: {
      title: '➕ Exercise B1 · am, is or are?',
      intro: 'Choose the correct form of “be” for the subject.',
      fr: 'Choisissez am, is ou are selon le sujet.',
      type: 'select',
      items: [
        {c:'I', t:'I ___ reading a good book at the moment.', o:['am','is','are'], a:'am', h:'I → am.'},
        {c:'she', t:'My daughter ___ studying for her exams.', o:['am','is','are'], a:'is', h:'she → is.'},
        {c:'they', t:'The neighbours ___ painting their house.', o:['am','is','are'], a:'are', h:'they → are.'},
        {c:'it', t:'Look! It ___ raining.', o:['am','is','are'], a:'is', h:'it → is.'},
        {c:'we', t:'We ___ sorting out the holiday photos.', o:['am','is','are'], a:'are', h:'we → are.'},
        {c:'he', t:'My husband ___ cooking dinner right now.', o:['am','is','are'], a:'is', h:'he → is.'},
        {c:'you', t:'You ___ making great progress!', o:['am','is','are'], a:'are', h:'you → are.'},
        {c:'it', t:'The dog ___ sleeping on the sofa.', o:['am','is','are'], a:'is', h:'The dog = it → is.'},
        {c:'they', t:'My children ___ visiting us this week.', o:['am','is','are'], a:'are', h:'they → are.'},
        {c:'I', t:'These days, I ___ getting back into my routine.', o:['am','is','are'], a:'am', h:'I → am.'}
      ]
    },
    B2: {
      title: '✏️ Exercise B2 · Write the full present continuous',
      intro: 'Write be + verb-ing. Short forms (she’s cooking) are accepted.',
      fr: 'Écrivez be + verbe-ing.',
      type: 'input',
      items: [
        {c:'cook', t:'Right now, she ___ dinner.', a:'is cooking', h:'she is + cooking'},
        {c:'make', t:'My son ___ a cake at the moment.', a:'is making', h:'make → making (lose the e)'},
        {c:'sit', t:'They ___ in the garden.', a:'are sitting', h:'sit → sitting (double t)'},
        {c:'write', t:'I ___ an email to my friend.', a:'am writing', h:'write → writing'},
        {c:'run', t:'Look! The dog ___ on the beach.', a:'is running', h:'run → running'},
        {c:'swim', t:'We ___ in the sea today.', a:'are swimming', h:'swim → swimming'},
        {c:'lie', t:'He ___ on the sofa.', a:'is lying', h:'lie → lying'},
        {c:'learn', t:'You ___ English with a lot of motivation!', a:'are learning', h:'you are + learning'}
      ]
    },
    B3: {
      title: '➖❓ Exercise B3 · Negatives and questions',
      intro: 'Choose the correct form.',
      fr: 'Négatif : am not / isn’t / aren’t. Question : Am / Is / Are en premier.',
      type: 'select',
      items: [
        {c:'she', t:'She ___ working today, she’s on holiday.', o:["isn't","aren't","doesn't"], a:"isn't", h:'she → isn’t.'},
        {c:'they', t:'___ they watching TV?', o:['Are','Is','Do'], a:'Are', h:'they → Are.'},
        {c:'I', t:'I ___ feeling tired today.', o:["'m not","isn't","don't"], a:"'m not", h:'I → I’m not.'},
        {c:'he', t:'___ your son studying at the moment?', o:['Is','Are','Does'], a:'Is', h:'your son = he → Is.'},
        {c:'we', t:'We ___ travelling this month.', o:["aren't","isn't","don't"], a:"aren't", h:'we → aren’t.'},
        {c:'you', t:'What ___ you doing this weekend?', o:['are','is','do'], a:'are', h:'you → are.'},
        {c:'it', t:'It ___ raining now. Let’s go out!', o:["isn't","aren't","doesn't"], a:"isn't", h:'it → isn’t.'},
        {c:'she', t:'Where ___ your daughter living now?', o:['is','are','does'], a:'is', h:'your daughter = she → is.'}
      ]
    },
    B4: {
      title: '🔍 Exercise B4 · Present simple or present continuous?',
      intro: 'Look for the keyword: habit (usually, every…) or now (now, at the moment, today…)?',
      fr: 'Habitude → présent simple. Maintenant → présent continu.',
      type: 'select',
      items: [
        {c:'usually', t:'She usually ___ at 7.', o:['gets up','is getting up'], a:'gets up', h:'usually = habit.'},
        {c:'right now', t:'Right now, she ___ a shower.', o:['has','is having'], a:'is having', h:'right now = now.'},
        {c:'every Saturday', t:'We ___ to the market every Saturday.', o:['go','are going'], a:'go', h:'every Saturday = habit.'},
        {c:'at the moment', t:'At the moment, I ___ the campervan.', o:['clean','am cleaning'], a:'am cleaning', h:'at the moment = now.'},
        {c:'never', t:'My son ___ on Sundays.', o:['never works','is never working'], a:'never works', h:'never = habit.'},
        {c:'Look!', t:'Look! The children ___ in the garden.', o:['play','are playing'], a:'are playing', h:'Look! = happening now.'},
        {c:'know', t:'I ___ this village very well.', o:['know','am knowing'], a:'know', h:'know = state verb, no -ing.'},
        {c:'this week', t:'This week, he ___ from home.', o:['works','is working'], a:'is working', h:'this week = temporary.'},
        {c:'often', t:'It ___ in Brittany.', o:['often rains','is often raining'], a:'often rains', h:'often = general fact.'},
        {c:'want', t:'She ___ to travel again.', o:['wants','is wanting'], a:'wants', h:'want = state verb.'}
      ]
    },

    /* ---------- PAST SIMPLE ---------- */
    C1: {
      title: '🔔 Exercise C1 · was or were?',
      intro: 'I / he / she / it → was. You / we / they → were.',
      fr: 'Seul « be » change au passé.',
      type: 'select',
      items: [
        {c:'the trip', t:'The trip ___ wonderful.', o:['was','were'], a:'was', h:'the trip = it.'},
        {c:'we', t:'We ___ tired after the long drive.', o:['was','were'], a:'were', h:'we → were.'},
        {c:'I', t:'I ___ happy to see my children.', o:['was','were'], a:'was', h:'I → was.'},
        {c:'the campsites', t:'The campsites ___ quiet.', o:['was','were'], a:'were', h:'plural → were.'},
        {c:'she', t:'My daughter ___ with us for a week.', o:['was','were'], a:'was', h:'she → was.'},
        {c:'you', t:'___ you on holiday last month?', o:['Was','Were'], a:'Were', h:'you → were.'},
        {c:'it', t:'It ___ not very sunny in Brittany.', o:['was','were'], a:'was', h:'it → was.'},
        {c:'there', t:'There ___ many families at the campsite.', o:['was','were'], a:'were', h:'many families = plural.'}
      ]
    },
    C2: {
      title: '✏️ Exercise C2 · Write the past simple',
      intro: 'Same form for all pronouns! Be careful with irregular verbs.',
      fr: 'Même forme pour tous les pronoms. Attention aux verbes irréguliers.',
      type: 'input',
      items: [
        {c:'go', t:'Yesterday, she ___ to the beach.', a:'went', h:'irregular: go → went'},
        {c:'come', t:'We ___ back home two weeks ago.', a:'came', h:'irregular: come → came'},
        {c:'visit', t:'My son ___ us last weekend.', a:'visited', h:'regular: + ed'},
        {c:'buy', t:'He ___ fresh bread at the market.', a:'bought', h:'irregular: buy → bought'},
        {c:'meet', t:'I ___ an old friend in town.', a:'met', h:'irregular: meet → met'},
        {c:'tidy', t:'They ___ the house on Saturday.', a:'tidied', h:'consonant + y → ied'},
        {c:'feel', t:'I ___ tired after the trip.', a:'felt', h:'irregular: feel → felt'},
        {c:'stop', t:'We ___ in a small village for lunch.', a:'stopped', h:'double the p'},
        {c:'see', t:'She ___ a beautiful sunset.', a:'saw', h:'irregular: see → saw'},
        {c:'have', t:'My children ___ a great time.', a:'had', h:'irregular: have → had'}
      ]
    },
    C3: {
      title: '➖ Exercise C3 · Negative: didn’t + base verb',
      intro: 'After didn’t, always use the base verb (no -ed, no irregular form).',
      fr: 'Après didn’t : verbe à la base.',
      type: 'select',
      items: [
        {t:'She ___ to work yesterday.', o:["didn't go","didn't went","doesn't went"], a:"didn't go", h:'didn’t + go.'},
        {t:'We ___ in a hotel.', o:["didn't stay","didn't stayed","don't stayed"], a:"didn't stay", h:'didn’t + stay.'},
        {t:'My son ___ with us on the trip.', o:["didn't come","didn't came","doesn't came"], a:"didn't come", h:'didn’t + come.'},
        {t:'I ___ much last night.', o:["didn't sleep","didn't slept","wasn't sleep"], a:"didn't sleep", h:'didn’t + sleep.'},
        {t:'They ___ a problem with the campervan.', o:["didn't have","didn't had","didn't has"], a:"didn't have", h:'didn’t + have.'},
        {t:'He ___ the dishes.', o:["didn't do","didn't did","didn't does"], a:"didn't do", h:'didn’t + do.'},
        {t:'The drive ___ easy.', o:["wasn't","didn't be","weren't"], a:"wasn't", h:'With “be”: wasn’t / weren’t (no didn’t!).', c:'be'},
        {t:'The roads ___ busy.', o:["weren't","didn't","wasn't"], a:"weren't", h:'plural + be → weren’t.', c:'be'}
      ]
    },
    C4: {
      title: '❓ Exercise C4 · Past questions',
      intro: 'Did + subject + base verb? With “be”: Was / Were + subject?',
      fr: 'Did + sujet + verbe à la base ? Avec « be » : Was / Were ?',
      type: 'select',
      items: [
        {t:'___ you ___ a good weekend?', blanks:[{o:['Did','Do','Were'],a:'Did'},{o:['have','had'],a:'have'}], h:'Did + have.'},
        {t:'Where ___ your daughter ___ on holiday?', blanks:[{o:['did','does','was'],a:'did'},{o:['go','went'],a:'go'}], h:'did + go.'},
        {t:'___ the weather nice?', o:['Was','Did','Were'], a:'Was', h:'the weather = it + be → Was.'},
        {t:'What ___ you ___ last Saturday?', blanks:[{o:['did','were','do'],a:'did'},{o:['do','did'],a:'do'}], h:'What did you DO?'},
        {t:'___ your children happy to see you?', o:['Were','Was','Did'], a:'Were', h:'children + be → Were.'},
        {t:'___ he ___ the campervan?', blanks:[{o:['Did','Does','Was'],a:'Did'},{o:['drive','drove'],a:'drive'}], h:'Did + drive.'},
        {t:'Did you enjoy the trip? — Yes, I ___.', o:['did','enjoyed','was'], a:'did', h:'Short answer: Yes, I did.'},
        {t:'Was it expensive? — No, it ___.', o:["wasn't","didn't","isn't"], a:"wasn't", h:'Short answer with be: No, it wasn’t.'}
      ]
    },
    C5: {
      title: '🔁 Exercise C5 · Transform: + → − and ?',
      intro: 'Write the negative and the question in the past.',
      fr: 'Écrivez la négation et la question au passé.',
      type: 'transform',
      items: [
        {t:'She went to the market.', n:"She didn't go to the market", q:'Did she go to the market', h:'went → didn’t GO / Did she GO?'},
        {t:'They visited a castle.', n:"They didn't visit a castle", q:'Did they visit a castle', h:'visited → didn’t VISIT.'},
        {t:'He bought a new bike.', n:"He didn't buy a new bike", q:'Did he buy a new bike', h:'bought → didn’t BUY.'},
        {t:'You had a good time.', n:"You didn't have a good time", q:'Did you have a good time', h:'had → didn’t HAVE.'},
        {t:'The campsite was expensive.', n:"The campsite wasn't expensive", q:'Was the campsite expensive', h:'be → wasn’t / Was … ?'}
      ]
    },

    /* ---------- FUTURE ---------- */
    D1: {
      title: '➕ Exercise D1 · am / is / are going to',
      intro: 'Choose the correct form of “be” before going to.',
      fr: 'Be (am / is / are) + going to + verbe.',
      type: 'select',
      items: [
        {c:'I', t:'I ___ going to catch up with my friends.', o:['am','is','are'], a:'am', h:'I → am.'},
        {c:'she', t:'My daughter ___ going to visit us next month.', o:['am','is','are'], a:'is', h:'she → is.'},
        {c:'we', t:'We ___ going to travel to Spain next year.', o:['am','is','are'], a:'are', h:'we → are.'},
        {c:'he', t:'He ___ going to repair the campervan.', o:['am','is','are'], a:'is', h:'he → is.'},
        {c:'they', t:'My children ___ going to spend Christmas with us.', o:['am','is','are'], a:'are', h:'they → are.'},
        {c:'it', t:'Look at the sky! It ___ going to rain.', o:['am','is','are'], a:'is', h:'it → is.'},
        {c:'you', t:'You ___ going to pass your exam!', o:['am','is','are'], a:'are', h:'you → are.'},
        {c:'I', t:'I ___ going to sort out the photos this weekend.', o:['am','is','are'], a:'am', h:'I → am.'}
      ]
    },
    D2: {
      title: '⚡ Exercise D2 · going to or will?',
      intro: 'Plan already decided → going to. Quick decision, offer, promise → will.',
      fr: 'Projet → going to. Décision immédiate, offre, promesse → will.',
      type: 'select',
      items: [
        {c:'plan', t:'We’ve booked the tickets. We ___ visit Lisbon in May.', o:['are going to','will'], a:'are going to', h:'Already booked = plan.'},
        {c:'offer', t:'Your bag looks heavy. I ___ help you.', o:["'m going to","'ll"], a:"'ll", h:'Offer on the moment → will.'},
        {c:'phone', t:'The phone is ringing! I ___ answer it.', o:["'m going to","'ll"], a:"'ll", h:'Quick decision → will.'},
        {c:'plan', t:'She ___ start a pottery class next week. She paid yesterday.', o:['is going to','will'], a:'is going to', h:'Paid = plan.'},
        {c:'promise', t:'Don’t worry, I ___ call you tomorrow.', o:["'m going to","'ll"], a:"'ll", h:'Promise → will.'},
        {c:'plan', t:'My son ___ move to Bordeaux in January.', o:['is going to','will'], a:'is going to', h:'Decided = plan.'},
        {c:'prediction', t:'I think you ___ love this book.', o:['are going to','will'], a:'will', h:'I think… → will (opinion / prediction).'},
        {c:'decision', t:'“We have no milk.” “OK, I ___ buy some.”', o:["'m going to","'ll"], a:"'ll", h:'Decision now → will.'}
      ]
    },
    D3: {
      title: '➖❓ Exercise D3 · Future negatives and questions',
      intro: 'Choose the correct form.',
      fr: 'Négatif : isn’t / aren’t going to, won’t. Question : Are you going to… ? Will you… ?',
      type: 'select',
      items: [
        {c:'she', t:'She ___ work on Saturday.', o:["isn't going to","aren't going to","doesn't going to"], a:"isn't going to", h:'she → isn’t going to.'},
        {c:'you', t:'___ you going to travel again soon?', o:['Are','Is','Do'], a:'Are', h:'you → Are.'},
        {c:'I', t:'I ___ forget this trip!', o:["won't","willn't","don't will"], a:"won't", h:'will not = won’t.'},
        {c:'he', t:'___ your son going to come for Christmas?', o:['Is','Are','Does'], a:'Is', h:'he → Is.'},
        {c:'they', t:'They ___ sell the campervan.', o:["aren't going to","isn't going to","don't going to"], a:"aren't going to", h:'they → aren’t going to.'},
        {c:'you', t:'___ you help me with this form, please?', o:['Will','Are','Do'], a:'Will', h:'Request → Will you…?'}
      ]
    },

    /* ---------- PRESENT PERFECT ---------- */
    E1: {
      title: '🔔 Exercise E1 · have or has?',
      intro: 'He / she / it → has. The others → have.',
      fr: 'He / she / it → has.',
      type: 'select',
      items: [
        {c:'I', t:'I ___ never been to Scotland.', o:['have','has'], a:'have', h:'I → have.'},
        {c:'she', t:'My sister ___ visited Canada twice.', o:['have','has'], a:'has', h:'she → has.'},
        {c:'they', t:'My children ___ already seen this film.', o:['have','has'], a:'have', h:'they → have.'},
        {c:'he', t:'___ your husband ever driven in England?', o:['Have','Has'], a:'Has', h:'he → Has.'},
        {c:'it', t:'It ___ rained a lot this week.', o:['have','has'], a:'has', h:'it → has.'},
        {c:'you', t:'___ you ever slept in a tent?', o:['Have','Has'], a:'Have', h:'you → Have.'},
        {c:'we', t:'We ___ just come back from our trip.', o:['have','has'], a:'have', h:'we → have.'},
        {c:'she', t:'She ___ never eaten snails.', o:['have','has'], a:'has', h:'she → has.'}
      ]
    },
    E2: {
      title: '✏️ Exercise E2 · Write the past participle',
      intro: 'have / has + past participle.',
      fr: 'have / has + participe passé.',
      type: 'input',
      items: [
        {c:'be', t:'Have you ever ___ to London?', a:'been', h:'be → been'},
        {c:'see', t:'I have never ___ the Northern Lights.', a:'seen', h:'see → seen'},
        {c:'eat', t:'She has ___ oysters in Brittany.', a:'eaten', h:'eat → eaten'},
        {c:'visit', t:'We have ___ many campsites.', a:'visited', h:'regular: visited'},
        {c:'do', t:'He has already ___ the shopping.', a:'done', h:'do → done'},
        {c:'drive', t:'Have you ever ___ a campervan?', a:'driven', h:'drive → driven'},
        {c:'travel', t:'They have ___ a lot this year.', a:'travelled|traveled', h:'travelled (UK) / traveled (US)'},
        {c:'make', t:'You have ___ great progress!', a:'made', h:'make → made'}
      ]
    },
    E3: {
      title: '⚠️ Exercise E3 · Present perfect or past simple?',
      intro: 'Finished time (yesterday, last…, ago, in 2020) → past simple. Experience, no time → present perfect.',
      fr: 'Moment terminé → past simple. Expérience sans date → present perfect.',
      type: 'select',
      items: [
        {c:'ever', t:'___ you ever ___ to Italy?', blanks:[{o:['Have','Did'],a:'Have'},{o:['been','went'],a:'been'}], h:'ever → present perfect.'},
        {c:'last summer', t:'Last summer, we ___ to Brittany.', o:['went','have gone'], a:'went', h:'last summer = finished time.'},
        {c:'never', t:'She ___ a campervan before.', o:['has never driven','never drove'], a:'has never driven', h:'never … before = experience.'},
        {c:'ago', t:'I ___ back two weeks ago.', o:['came','have come'], a:'came', h:'ago → past simple.'},
        {c:'in 2019', t:'My son ___ to Canada in 2019.', o:['travelled','has travelled'], a:'travelled', h:'in 2019 = finished time.'},
        {c:'already', t:'I ___ already ___ the photos.', blanks:[{o:['have','did'],a:'have'},{o:['sorted out','sort out'],a:'sorted out'}], h:'already → present perfect.'},
        {c:'yesterday', t:'Yesterday, she ___ her friends.', o:['called','has called'], a:'called', h:'yesterday → past simple.'},
        {c:'just', t:'We ___ just ___ lunch.', blanks:[{o:['have','did'],a:'have'},{o:['had','have'],a:'had'}], h:'just → present perfect: have just had.'}
      ]
    },

    /* ---------- MIXED ---------- */
    F1: {
      title: '🧩 Exercise F1 · Mixed tenses with keywords',
      intro: 'Find the keyword and the subject, then choose.',
      fr: 'Mot-clé + sujet → le bon temps.',
      type: 'select',
      items: [
        {c:'every day', t:'My daughter ___ me every day.', o:['calls','is calling','called','has called'], a:'calls', h:'every day = habit + she → calls.'},
        {c:'now', t:'Shh! The baby ___ now.', o:['sleeps','is sleeping','slept','will sleep'], a:'is sleeping', h:'now → present continuous.'},
        {c:'yesterday', t:'Yesterday, we ___ a long walk.', o:['take','are taking','took','have taken'], a:'took', h:'yesterday → past simple.'},
        {c:'next week', t:'Next week, he ___ start a new job.', o:['is going to','starts to','started','has'], a:'is going to', h:'next week, plan → going to.'},
        {c:'ever', t:'___ she ever ___ to Spain?', blanks:[{o:['Has','Did','Does'],a:'Has'},{o:['been','go','went'],a:'been'}], h:'ever → Has … been.'},
        {c:'usually', t:'They ___ at home on Sundays.', o:['usually stay','are usually staying','usually stayed'], a:'usually stay', h:'usually → present simple.'},
        {c:'at the moment', t:'At the moment, I ___ a lot of photos.', o:['sort out','am sorting out','sorted out'], a:'am sorting out', h:'at the moment → am + -ing.'},
        {c:'two days ago', t:'My son ___ us two days ago.', o:['visits','is visiting','visited','has visited'], a:'visited', h:'ago → past simple.'},
        {c:'never', t:'It ___ in July here.', o:['never snows','is never snowing','never snow'], a:'never snows', h:'fact + it → snows.'},
        {c:'decision now', t:'“I’m cold.” “I ___ close the window.”', o:["'ll","'m going to","close"], a:"'ll", h:'Quick decision → will.'},
        {c:'last night', t:'She ___ very well last night.', o:["didn't sleep","doesn't sleep","hasn't slept"], a:"didn't sleep", h:'last night → didn’t + base.'},
        {c:'this week', t:'___ your children ___ with you this week?', blanks:[{o:['Are','Do','Did'],a:'Are'},{o:['staying','stay','stayed'],a:'staying'}], h:'this week (temporary) → Are … staying?'}
      ]
    },
    F2: {
      title: '🎯 Exercise F2 · Which answer matches the question?',
      intro: 'In CLOE, your answer must use the same helper word as the question.',
      fr: 'La réponse reprend l’auxiliaire de la question (do / does / did / is / have…).',
      type: 'mcq',
      items: [
        {q:'Does your son live near you?', o:['Yes, he does.','Yes, he is.','Yes, he lives.'], a:'Yes, he does.', h:'Does → does.'},
        {q:'Are you working this week?', o:['Yes, I am.','Yes, I do.','Yes, I work.'], a:'Yes, I am.', h:'Are → am.'},
        {q:'Did you enjoy your holiday?', o:['Yes, I did.','Yes, I enjoyed.','Yes, I was.'], a:'Yes, I did.', h:'Did → did.'},
        {q:'Have you ever been to England?', o:['Yes, I have.','Yes, I went.','Yes, I did.'], a:'Yes, I have.', h:'Have → have.'},
        {q:'Is your daughter going to visit you?', o:['Yes, she is.','Yes, she does.','Yes, she will go.'], a:'Yes, she is.', h:'Is → is.'},
        {q:'Was the weather good?', o:['No, it wasn’t.','No, it didn’t.','No, it doesn’t.'], a:'No, it wasn’t.', h:'Was → wasn’t.'},
        {q:'What do you usually do on Sundays?', o:['I usually go for a walk.','I went for a walk.','I am going for a walk.'], a:'I usually go for a walk.', h:'do + usually → present simple.'},
        {q:'What did you do last weekend?', o:['I visited my family.','I visit my family.','I have visited my family.'], a:'I visited my family.', h:'did + last weekend → past simple.'}
      ]
    },

    /* ---------- PHRASAL VERBS ---------- */
    PV1: {
      title: '💡 Exercise PV1 · What does it mean?',
      intro: 'Choose the correct meaning.',
      fr: 'Choisissez la bonne signification.',
      type: 'mcq',
      items: [
        {q:'look after', o:['take care of','look for','watch TV'], a:'take care of', h:'She looks after her grandchildren.'},
        {q:'find out', o:['get information','go outside','lose something'], a:'get information', h:'I found out the shop was closed.'},
        {q:'catch up with', o:['share news after some time','run after a bus','close the door'], a:'share news after some time', h:'Let’s catch up with friends.'},
        {q:'tidy up', o:['make a place neat','wake up late','buy something'], a:'make a place neat', h:'Tidy up the kitchen.'},
        {q:'look forward to', o:['be excited about the future','look behind you','forget'], a:'be excited about the future', h:'I’m looking forward to the holidays.'},
        {q:'run out of', o:['have no more of something','go jogging','leave quickly'], a:'have no more of something', h:'We ran out of milk.'},
        {q:'give up', o:['stop trying','give a present','stand up'], a:'stop trying', h:'Don’t give up!'},
        {q:'settle back in', o:['feel normal at home again','sit on a chair','move house'], a:'feel normal at home again', h:'After a trip, you settle back in.'}
      ]
    },
    PV2: {
      title: '🧲 Exercise PV2 · Choose the small word',
      intro: 'Complete the phrasal verb with the correct particle.',
      fr: 'Complétez avec la bonne particule.',
      type: 'select',
      items: [
        {t:'It’s dark. Can you turn ___ the light, please?', o:['on','off','up'], a:'on', h:'dark → turn on.'},
        {t:'I usually get ___ at 7 o’clock.', o:['up','out','on'], a:'up', h:'get up = leave your bed.'},
        {t:'She looks ___ her grandchildren on Wednesdays.', o:['after','for','at'], a:'after', h:'look after = take care of.'},
        {t:'I’m looking ___ my keys. Have you seen them?', o:['for','after','up'], a:'for', h:'look for = try to find.'},
        {t:'We came ___ from our trip two weeks ago.', o:['back','up','off'], a:'back', h:'come back = return.'},
        {t:'Please fill ___ this form.', o:['in','on','up'], a:'in', h:'fill in a form.'},
        {t:'Don’t throw ___ those maps, I want to keep them!', o:['away','out','off'], a:'away', h:'throw away = put in the bin.'},
        {t:'I get ___ very well with my neighbours.', o:['on','up','off'], a:'on', h:'get on with = have a good relationship.'},
        {t:'Can you pick me ___ at the station?', o:['up','on','out'], a:'up', h:'pick up = collect.'},
        {t:'Take a deep breath and calm ___.', o:['down','up','off'], a:'down', h:'calm down.'}
      ]
    },
    PV3: {
      title: '🔄 Exercise PV3 · Conjugate the phrasal verb',
      intro: 'Only the verb changes, the small word stays. Look at the subject and the keyword!',
      fr: 'Seul le verbe se conjugue. Regardez le sujet et le mot-clé.',
      type: 'input',
      items: [
        {c:'get up · present', t:'Every morning, she ___ at 6:30.', a:'gets up', h:'she + every morning → gets up'},
        {c:'come back · past', t:'We ___ from Brittany last month.', a:'came back', h:'last month → came back'},
        {c:'tidy up · now', t:'Right now, he ___ the garage.', a:'is tidying up', h:'right now → is tidying up'},
        {c:'catch up with · plan', t:'Next Saturday, I ___ my friends.', a:'am going to catch up with', h:'plan → am going to catch up with'},
        {c:'look after · habit', t:'My mother ___ the dog when we travel.', a:'looks after', h:'she + habit → looks after'},
        {c:'find out · past', t:'Yesterday, I ___ that the museum was closed.', a:'found out', h:'find → found'},
        {c:'not / wake up · present', t:'He ___ early on Sundays.', a:"doesn't wake up", h:'he → doesn’t wake up'},
        {c:'look forward to · now', t:'I ___ the next trip!', a:'am looking forward to', h:'I am looking forward to…'},
        {c:'give up · negative past', t:'She ___ when English was difficult.', a:"didn't give up", h:'didn’t + give up'},
        {c:'grow up · question past', t:'Where did you ___?', a:'grow up', h:'did + base verb → grow up'}
      ]
    },
    PV4: {
      title: '📍 Exercise PV4 · Where does the pronoun go?',
      intro: 'With a pronoun (it, them, her…), put it in the middle: turn it off.',
      fr: 'Le pronom se place entre le verbe et la particule.',
      type: 'select',
      items: [
        {t:'The TV is too loud. Please ___.', o:['turn it down','turn down it'], a:'turn it down', h:'verb + it + particle.'},
        {t:'Your coat is on the floor. ___, please.', o:['Pick it up','Pick up it'], a:'Pick it up', h:'pick + it + up.'},
        {t:'These old magazines? ___.', o:['Throw them away','Throw away them'], a:'Throw them away', h:'throw + them + away.'},
        {t:'Here is the form. Can you ___?', o:['fill it in','fill in it'], a:'fill it in', h:'fill + it + in.'},
        {t:'Your shoes are dirty. ___ before you come in, please.', o:['Take them off','Take off them'], a:'Take them off', h:'take + them + off.'},
        {t:'My granddaughter? I ___ on Wednesdays.', o:['look after her','look her after'], a:'look after her', h:'look after is inseparable: look after her.'}
      ]
    },
    PV5: {
      title: '🧱 Exercise PV5 · Build the sentence',
      intro: 'Click the words in the right order. Click a word again to remove it.',
      fr: 'Cliquez sur les mots dans le bon ordre.',
      type: 'tiles',
      items: [
        {w:['She','gets','up','at','seven'], a:'She gets up at seven', h:'Subject + verb-s + up + time.'},
        {w:['I','am','looking','forward','to','the','weekend'], a:'I am looking forward to the weekend', h:'I am + looking forward to + …'},
        {w:['Did','you','catch','up','with','your','friends','?'], a:'Did you catch up with your friends ?', h:'Did + you + base verb…?'},
        {w:['He','doesn\'t','look','after','the','dog'], a:"He doesn't look after the dog", h:'He + doesn’t + base verb.'},
        {w:['Please','turn','it','off'], a:'Please turn it off', h:'turn + it + off.'}
      ]
    },

    /* ---------- LISTENING ---------- */
    L1: {
      title: '🎧 Exercise L1 · Understand Claire',
      intro: 'Choose the correct answer. Notice the he / she forms!',
      fr: 'Attention aux formes avec he / she.',
      type: 'mcq',
      items: [
        {q:'What time does Claire get up during the week?', o:['She gets up at half past six.','She get up at half past six.','She gets up at eight.'], a:'She gets up at half past six.', h:'Listen for “half past six”… and remember she + -s.'},
        {q:'What does she do first on Saturdays?', o:['She takes the dog out for a walk.','She has breakfast.','She goes to the market.'], a:'She takes the dog out for a walk.', h:'Listen for “First…”.'},
        {q:'Where does her son live?', o:['He lives in Bordeaux.','He lives with Claire.','He lives in Spain.'], a:'He lives in Bordeaux.', h:'Listen for a city name.'},
        {q:'What does her son do?', o:['He works in a restaurant.','He works in a bank.','He doesn’t work.'], a:'He works in a restaurant.', h:'Claire works in a bank. Her son…?'},
        {q:'How often does he call?', o:['Every Sunday evening.','Every Saturday.','Every day.'], a:'Every Sunday evening.', h:'Listen for “every…”.'},
        {q:'Why is Claire learning Spanish?', o:['Because they are going to travel to Spain.','Because her son lives in Spain.','Because she works in Spain.'], a:'Because they are going to travel to Spain.', h:'Listen for “next summer”.'},
        {q:'What did they do last Saturday?', o:['They stayed at home and watched films.','They went to the market.','They went to the beach.'], a:'They stayed at home and watched films.', h:'It rained all day…'},
        {q:'Which sentence is correct?', o:['Claire doesn’t set an alarm on Saturdays.','Claire don’t set an alarm on Saturdays.','Claire doesn’t sets an alarm on Saturdays.'], a:'Claire doesn’t set an alarm on Saturdays.', h:'doesn’t + base verb.'}
      ]
    },
    L2: {
      title: '✍️ Exercise L2 · Write about Claire',
      intro: 'Complete the sentences about Claire. Use the correct tense and the he / she form.',
      fr: 'Complétez avec le bon temps et la bonne forme.',
      type: 'input',
      items: [
        {c:'live', t:'Claire ___ near the sea.', a:'lives', h:'she → lives'},
        {c:'not / set', t:'On Saturdays, she ___ an alarm.', a:"doesn't set", h:'she → doesn’t set'},
        {c:'work', t:'Her son ___ in a restaurant.', a:'works', h:'he → works'},
        {c:'call', t:'He ___ every Sunday evening.', a:'calls', h:'he → calls'},
        {c:'learn · now', t:'Right now, she ___ Spanish.', a:'is learning', h:'now → is learning'},
        {c:'rain · past', t:'Last Saturday, it ___ all day.', a:'rained', h:'last Saturday → rained'},
        {c:'travel · plan', t:'Next summer, they ___ to Spain.', a:'are going to travel', h:'plan → are going to travel'}
      ]
    }
  };

  /* =========================================================
     7. EXERCISE ENGINE
     ========================================================= */
  var STATE = {}; // blockId -> array of booleans

  function updateBlockScore(id){
    var block = $('[data-block="' + id + '"]');
    if (!block) return;
    var arr = STATE[id] || [];
    var good = arr.filter(Boolean).length;
    var badge = $('.block-score', block);
    if (badge) badge.textContent = '✅ ' + good + ' / ' + arr.length;
    updateGlobal();
  }
  function updateGlobal(){
    var total = 0, good = 0;
    Object.keys(STATE).forEach(function(k){ total += STATE[k].length; good += STATE[k].filter(Boolean).length; });
    var gs = $('#globalScore'); if (gs) gs.textContent = good + ' / ' + total;
    var gm = $('#globalMeter'); if (gm) gm.style.width = (total ? Math.round(good / total * 100) : 0) + '%';
  }
  function setRow(id, index, ok, row){
    STATE[id][index] = ok;
    if (row){
      row.classList.toggle('ok', ok === true);
      row.classList.toggle('no', ok === false);
      var st = $('.status', row);
      if (st) st.textContent = ok ? '✅' : '❌';
    }
    updateBlockScore(id);
  }

  function blockHeader(id, def){
    return '<div class="exercise-head"><div><h3>' + esc(def.title) + '</h3><p>' + esc(def.intro) + '</p>'
      + (def.fr ? '<p class="fr">' + esc(def.fr) + '</p>' : '') + '</div>'
      + '<div class="head-tools"><span class="block-score">✅ 0 / ' + def.items.length + '</span>'
      + '<button class="reset-btn" type="button" data-reset="' + id + '">↺ Reset</button></div></div>';
  }
  function cueHtml(c){ return c ? '<span class="cue">' + esc(c) + '</span>' : ''; }
  function rowTools(item){
    return '<div class="row-tools">'
      + '<span class="status" aria-live="polite"></span>'
      + (item.h ? '<button class="hint-btn" type="button" data-row-hint>💡</button>' : '')
      + '<button class="small-btn" type="button" data-row-answer title="Show the answer">👁</button>'
      + '</div>';
  }

  function renderSelect(id, def, el){
    var html = blockHeader(id, def) + '<div class="ex-list">';
    def.items.forEach(function(item, i){
      var blanks = item.blanks || [{o:item.o, a:item.a}];
      var parts = item.t.split('___');
      var sentence = '';
      parts.forEach(function(p, k){
        sentence += esc(p);
        if (k < blanks.length){
          var b = blanks[k];
          sentence += '<select data-i="' + i + '" data-k="' + k + '" aria-label="Choose"><option value="">Choose…</option>'
            + shuffleOptions(b.o, b.a).map(function(o){ return '<option>' + esc(o) + '</option>'; }).join('') + '</select>';
        }
      });
      var answerText = item.t;
      blanks.forEach(function(b){ answerText = answerText.replace('___', b.a); });
      html += '<div class="ex-row" data-i="' + i + '"><span class="num">' + (i + 1) + '</span>'
        + '<p class="ex-sentence">' + cueHtml(item.c) + sentence + '</p>' + rowTools(item)
        + (item.h ? '<div class="inline-hint">💡 ' + esc(item.h) + '</div>' : '')
        + '<div class="inline-answer">✔ ' + esc(answerText) + ' <button class="say-mini" type="button" data-say="' + esc(answerText) + '">🔊</button></div></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    STATE[id] = def.items.map(function(){ return false; });

    $all('.ex-row', el).forEach(function(row){
      var i = +row.getAttribute('data-i');
      var item = def.items[i];
      var blanks = item.blanks || [{o:item.o, a:item.a}];
      var selects = $all('select', row);
      selects.forEach(function(sel){
        sel.addEventListener('change', function(){
          var k = +sel.getAttribute('data-k');
          var ok = sel.value === blanks[k].a;
          sel.classList.toggle('field-correct', ok);
          sel.classList.toggle('field-wrong', !ok && sel.value !== '');
          var allFilled = selects.every(function(s){ return s.value !== ''; });
          var allOk = selects.every(function(s){ return s.value === blanks[+s.getAttribute('data-k')].a; });
          if (allFilled) setRow(id, i, allOk, row);
          else if (!ok) setRow(id, i, false, row);
        });
      });
    });
  }

  function renderInput(id, def, el){
    var html = blockHeader(id, def) + '<div class="ex-list">';
    def.items.forEach(function(item, i){
      var parts = item.t.split('___');
      var first = String(item.a).split('|')[0];
      var answerText = item.t.replace('___', first);
      html += '<div class="ex-row" data-i="' + i + '"><span class="num">' + (i + 1) + '</span>'
        + '<p class="ex-sentence">' + cueHtml(item.c) + esc(parts[0]) + '<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer" placeholder="…" />' + esc(parts[1] || '')
        + '</p>'
        + '<div class="row-tools"><span class="status"></span><button class="check-btn small-btn" type="button" data-row-check>✓</button>'
        + (item.h ? '<button class="hint-btn" type="button" data-row-hint>💡</button>' : '')
        + '<button class="small-btn" type="button" data-row-answer title="Show the answer">👁</button></div>'
        + (item.h ? '<div class="inline-hint">💡 ' + esc(item.h) + '</div>' : '')
        + '<div class="inline-answer">✔ ' + esc(answerText) + ' <button class="say-mini" type="button" data-say="' + esc(answerText) + '">🔊</button></div></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    STATE[id] = def.items.map(function(){ return false; });

    $all('.ex-row', el).forEach(function(row){
      var i = +row.getAttribute('data-i');
      var input = $('input', row);
      function check(){
        if (!input.value.trim()) return;
        var ok = matches(input.value, def.items[i].a);
        input.classList.toggle('field-correct', ok);
        input.classList.toggle('field-wrong', !ok);
        setRow(id, i, ok, row);
      }
      input.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); check(); } });
      input.addEventListener('blur', check);
      input.addEventListener('input', function(){ input.classList.remove('field-correct','field-wrong'); });
      $('[data-row-check]', row).addEventListener('click', check);
    });
  }

  function renderTransform(id, def, el){
    var html = blockHeader(id, def) + '<div class="ex-list">';
    def.items.forEach(function(item, i){
      var n = String(item.n).split('|')[0] + '.';
      var q = String(item.q).split('|')[0] + '?';
      html += '<div class="ex-row" data-i="' + i + '"><span class="num">' + (i + 1) + '</span>'
        + '<div><p class="ex-sentence"><span class="cue">➕</span><strong>' + esc(item.t) + '</strong> <button class="say-mini" type="button" data-say="' + esc(item.t) + '">🔊</button></p>'
        + '<div class="transform-grid"><label>➖ Negative<input type="text" data-part="n" autocomplete="off" autocapitalize="off" spellcheck="false" /></label>'
        + '<label>❓ Question<input type="text" data-part="q" autocomplete="off" autocapitalize="off" spellcheck="false" /></label></div></div>'
        + '<div class="row-tools"><span class="status"></span><button class="check-btn small-btn" type="button" data-row-check>✓</button>'
        + '<button class="hint-btn" type="button" data-row-hint>💡</button><button class="small-btn" type="button" data-row-answer>👁</button></div>'
        + '<div class="inline-hint">💡 ' + esc(item.h) + '</div>'
        + '<div class="inline-answer">➖ ' + esc(n) + '<br>❓ ' + esc(q) + '</div></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    STATE[id] = def.items.map(function(){ return false; });

    $all('.ex-row', el).forEach(function(row){
      var i = +row.getAttribute('data-i');
      var item = def.items[i];
      var nIn = $('[data-part="n"]', row), qIn = $('[data-part="q"]', row);
      function checkOne(inp, ans){
        if (!inp.value.trim()) return null;
        var ok = matches(inp.value, ans);
        inp.classList.toggle('field-correct', ok);
        inp.classList.toggle('field-wrong', !ok);
        return ok;
      }
      function check(){
        var a = checkOne(nIn, item.n), b = checkOne(qIn, item.q);
        if (a === null || b === null){
          if (a === false || b === false) setRow(id, i, false, row);
          return;
        }
        setRow(id, i, a && b, row);
      }
      [nIn, qIn].forEach(function(inp){
        inp.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); check(); } });
        inp.addEventListener('blur', check);
        inp.addEventListener('input', function(){ inp.classList.remove('field-correct','field-wrong'); });
      });
      $('[data-row-check]', row).addEventListener('click', check);
    });
  }

  function renderMcq(id, def, el){
    var html = blockHeader(id, def) + '<div class="quiz-grid">';
    def.items.forEach(function(item, i){
      html += '<article class="quiz-card" data-i="' + i + '"><h4>' + (i + 1) + '. ' + esc(item.q)
        + ' <button class="say-mini" type="button" data-say="' + esc(item.q) + '">🔊</button></h4><div class="choice-row">'
        + shuffleOptions(item.o, item.a).map(function(o){ return '<button type="button" data-val="' + esc(o) + '">' + esc(o) + '</button>'; }).join('')
        + '</div>' + (item.h ? '<button class="hint-btn" type="button" data-card-hint>💡 Hint</button><p class="hint">' + esc(item.h) + '</p>' : '')
        + '<p class="feedback"></p></article>';
    });
    html += '</div>';
    el.innerHTML = html;
    STATE[id] = def.items.map(function(){ return false; });

    $all('.quiz-card', el).forEach(function(card){
      var i = +card.getAttribute('data-i');
      var item = def.items[i];
      var fb = $('.feedback', card);
      $all('.choice-row button', card).forEach(function(btn){
        btn.addEventListener('click', function(){
          $all('.choice-row button', card).forEach(function(b){ b.classList.remove('correct-choice','wrong-choice'); });
          var ok = btn.getAttribute('data-val') === item.a;
          btn.classList.add(ok ? 'correct-choice' : 'wrong-choice');
          fb.textContent = ok ? '✅ Correct! Well done.' : '❌ Not this one. Try again or open the hint.';
          fb.className = 'feedback ' + (ok ? 'good' : 'bad');
          setRow(id, i, ok, null);
        });
      });
    });
  }

  function renderTiles(id, def, el){
    var html = blockHeader(id, def);
    def.items.forEach(function(item, i){
      html += '<div class="tile-card" data-i="' + i + '"><strong>' + (i + 1) + '.</strong> <span class="status"></span>'
        + '<div class="tile-answer" aria-label="Your sentence"></div>'
        + '<div class="tile-bank">' + shuffle(item.w.map(function(w, k){ return {w:w, k:k}; })).map(function(t){
            return '<button class="tile" type="button" data-k="' + t.k + '">' + esc(t.w) + '</button>';
          }).join('') + '</div>'
        + '<div class="actions-row"><button class="hint-btn" type="button" data-tile-hint>💡 Hint</button><button class="small-btn" type="button" data-tile-answer>👁 Answer</button><button class="reset-btn" type="button" data-tile-clear>↺ Clear</button></div>'
        + '<p class="hint">' + esc(item.h) + '</p><p class="hint tile-solution">✔ ' + esc(item.a.replace(' ?', '?')) + '</p></div>';
    });
    el.innerHTML = html;
    STATE[id] = def.items.map(function(){ return false; });

    $all('.tile-card', el).forEach(function(card){
      var i = +card.getAttribute('data-i');
      var item = def.items[i];
      var answer = $('.tile-answer', card), bank = $('.tile-bank', card), st = $('.status', card);
      function check(){
        var used = $all('.tile', answer);
        if (used.length < item.w.length){ card.classList.remove('ok','no'); st.textContent = ''; return; }
        var sentence = used.map(function(t){ return t.textContent; }).join(' ');
        var ok = matches(sentence, item.a);
        card.classList.toggle('ok', ok); card.classList.toggle('no', !ok);
        st.textContent = ok ? '✅ Perfect!' : '❌ Not quite. Click a word to move it back.';
        setRow(id, i, ok, null);
      }
      bank.addEventListener('click', function(e){
        var t = e.target.closest('.tile'); if (!t || t.classList.contains('used')) return;
        t.classList.add('used');
        var clone = document.createElement('button');
        clone.type = 'button'; clone.className = 'tile'; clone.textContent = t.textContent; clone.setAttribute('data-k', t.getAttribute('data-k'));
        answer.appendChild(clone);
        check();
      });
      answer.addEventListener('click', function(e){
        var t = e.target.closest('.tile'); if (!t) return;
        var orig = $('.tile[data-k="' + t.getAttribute('data-k') + '"]', bank);
        if (orig) orig.classList.remove('used');
        t.remove();
        check();
      });
      $('[data-tile-clear]', card).addEventListener('click', function(){
        answer.innerHTML = ''; $all('.tile', bank).forEach(function(t){ t.classList.remove('used'); });
        card.classList.remove('ok','no'); st.textContent = ''; setRow(id, i, false, null);
      });
      $('[data-tile-hint]', card).addEventListener('click', function(){ $all('.hint', card)[0].classList.toggle('show'); });
      $('[data-tile-answer]', card).addEventListener('click', function(){ $('.tile-solution', card).classList.toggle('show'); });
    });
  }

  function renderBlock(id){
    var el = $('[data-block="' + id + '"]');
    var def = EX[id];
    if (!el || !def) return;
    if (def.type === 'select') renderSelect(id, def, el);
    else if (def.type === 'input') renderInput(id, def, el);
    else if (def.type === 'transform') renderTransform(id, def, el);
    else if (def.type === 'mcq') renderMcq(id, def, el);
    else if (def.type === 'tiles') renderTiles(id, def, el);
    updateBlockScore(id);
  }

  // Delegated row tools
  document.addEventListener('click', function(e){
    var hintBtn = e.target.closest('[data-row-hint]');
    if (hintBtn){ var r = hintBtn.closest('.ex-row'); var h = r && $('.inline-hint', r); if (h) h.classList.toggle('show'); return; }
    var ansBtn = e.target.closest('[data-row-answer]');
    if (ansBtn){ var r2 = ansBtn.closest('.ex-row'); var a = r2 && $('.inline-answer', r2); if (a) a.classList.toggle('show'); return; }
    var cardHint = e.target.closest('[data-card-hint]');
    if (cardHint){ var c = cardHint.closest('.quiz-card'); var ch = c && $('.hint', c); if (ch) ch.classList.toggle('show'); return; }
    var reset = e.target.closest('[data-reset]');
    if (reset){ renderBlock(reset.getAttribute('data-reset')); }
  });

  Object.keys(EX).forEach(renderBlock);

  /* =========================================================
     8. LISTENING
     ========================================================= */
  var claireStory = "Hi, I'm Claire. I live in a small house near the sea with my husband and our dog, Biscuit. During the week, I work in a bank, so I get up at half past six. But on Saturdays, I don't set an alarm. I usually wake up at about eight. First, I take the dog out for a walk on the beach. Then I have breakfast with my husband. After that, we tidy up the house together, and in the afternoon we often go to the market. My son doesn't live with us any more. He lives in Bordeaux and he works in a restaurant. He calls us every Sunday evening. Right now, I'm learning Spanish, because next summer we're going to travel to Spain. Last Saturday was different: it rained all day, so we stayed at home and watched films. It was lovely!";
  var tBox = $('#transcriptBox');
  if (tBox) tBox.innerHTML = '<p><strong>Transcript:</strong> ' + esc(claireStory) + '</p>';
  var ls = $('#listenStory'); if (ls) ls.addEventListener('click', function(){ speak(claireStory, 0.88); });
  var lss = $('#listenStorySlow'); if (lss) lss.addEventListener('click', function(){ speak(claireStory, 0.68); });
  var tt = $('#toggleTranscript');
  if (tt) tt.addEventListener('click', function(){
    tBox.hidden = !tBox.hidden;
    tt.textContent = tBox.hidden ? 'Show transcript' : 'Hide transcript';
  });

  /* =========================================================
     9. SPEAKING CARDS (3 model levels)
     ========================================================= */
  var speakingPrompts = [
    {tag:'Present simple · feelings', q:'How does it feel to be back home after your trip?',
      m:{'A2':'It feels good. I am happy to be at home, but I miss the trip a little.',
         'A2+':'It feels a bit strange! I’m happy to see my house and my garden again, but I miss the freedom of the campervan.',
         'B1':'Honestly, I have mixed feelings. I’m glad to be back in my own bed, but I miss the freedom we had on the road. I’m slowly settling back in.'},
      turn:'Start with “It feels…”, then add “but I miss…”.'},
    {tag:'Present simple · routine', q:'What do you usually do on a Saturday?',
      m:{'A2':'On Saturday, I get up late. I go to the market and I cook.',
         'A2+':'On Saturdays, I usually get up at about eight. I go to the market in the morning and in the afternoon I relax or go for a walk.',
         'B1':'Saturday is my favourite day. I don’t set an alarm, so I get up quite late. I usually go to the market, then I tidy up the house and, in the evening, we sometimes invite friends over.'},
      turn:'Use: usually, often, sometimes, never + present simple.'},
    {tag:'Present simple · he / she', q:'Tell me about someone in your family. Where does he or she live? What does he or she do?',
      m:{'A2':'My daughter lives in Nantes. She works in a shop. She likes sport.',
         'A2+':'I’d like to talk about my son. He lives in a flat in the city and he works in an office. He doesn’t have a car, so he cycles to work.',
         'B1':'My sister lives about an hour from me. She works as a nurse, so she has very long days. She loves gardening and she grows her own vegetables. We don’t see each other every week, but she calls me very often.'},
      turn:'Choose one person. Every verb needs -s: he lives, she works, he doesn’t have…'},
    {tag:'Present continuous', q:'What are you doing these days? Are you working on any projects at home?',
      m:{'A2':'These days, I am working a lot. I am sorting the photos of the trip.',
         'A2+':'At the moment, I’m getting back into my routine. I’m also sorting out all the photos from the trip. It’s taking a long time!',
         'B1':'These days, I’m trying to get organised after the holidays. I’m sorting out the photos and I’m making a little album for my family. I’m also improving my English, of course!'},
      turn:'Use: these days / at the moment + am / is / are + -ing.'},
    {tag:'Past simple', q:'What did you do last weekend?',
      m:{'A2':'Last weekend, I stayed at home. I cleaned the house and I watched a film.',
         'A2+':'Last weekend, I visited my family. We had lunch together and then we went for a walk. It was very nice.',
         'B1':'Last weekend was quite busy. On Saturday, I did the shopping and caught up with a friend over coffee. On Sunday, it rained, so we stayed in and watched a film. It was relaxing.'},
      turn:'Use: On Saturday… Then… After that… It was…'},
    {tag:'Future · going to', q:'What are you going to do next weekend or during your next holidays?',
      m:{'A2':'Next weekend, I am going to see my friends. We are going to eat at a restaurant.',
         'A2+':'Next weekend, I’m going to catch up with some friends. We’re going to have dinner together. I’m really looking forward to it.',
         'B1':'For my next holidays, we’re going to take the campervan again, probably to the mountains. We haven’t booked anything yet, but I’m going to look for some nice campsites.'},
      turn:'Use: I’m going to… / We’re going to… + I’m looking forward to…'},
    {tag:'Present perfect', q:'Have you ever visited another country? Tell me about it.',
      m:{'A2':'Yes, I have. I have been to Spain. It was hot and beautiful.',
         'A2+':'Yes, I have. I’ve been to Spain and Italy. I went to Italy five years ago and I loved the food.',
         'B1':'Yes, I’ve been to a few countries. I’ve visited Spain several times, but my best memory is Scotland: I went there a few years ago and the landscapes were amazing. I’ve never been to the United States, but I’d love to go.'},
      turn:'Start with “Yes, I have / No, I haven’t”. Details with a date → past simple.'},
    {tag:'Describe · there is / are', q:'Can you describe your home?',
      m:{'A2':'I live in a house. There is a kitchen, a living room and three bedrooms. There is a garden.',
         'A2+':'I live in a house near the sea. There are three bedrooms and there’s a big kitchen. My favourite room is the living room because it’s bright.',
         'B1':'We live in a comfortable house not far from the sea. Downstairs, there’s an open kitchen and a living room, and upstairs there are three bedrooms. What I love most is the garden: we have breakfast outside when the weather is nice.'},
      turn:'Use: There is / There are + My favourite room is… because…'},
    {tag:'Opinion', q:'Do you prefer holidays in a campervan or in a hotel? Why?',
      m:{'A2':'I prefer the campervan. It is more free. I can change my plans.',
         'A2+':'I prefer the campervan because it’s more flexible. In a hotel, you stay in one place, but with a campervan you can discover new places every day.',
         'B1':'Personally, I prefer the campervan. It’s less comfortable than a hotel, but it’s much more flexible. You can change your plans when you want, and you feel closer to nature. On the other hand, a hotel is more relaxing for a short break.'},
      turn:'Use: I prefer… because… / It’s more… than… / On the other hand…'},
    {tag:'Phrasal verbs', q:'How do you usually relax after a busy day?',
      m:{'A2':'I sit on the sofa. I turn on the TV. I calm down.',
         'A2+':'When I get back home, I take off my shoes, put on some music and just chill out. Sometimes I call a friend to catch up.',
         'B1':'After a busy day, I need to slow down. I usually take the dog out for a walk, then I cook something simple. In the evening, I turn off my phone and read a good book. It really helps me calm down.'},
      turn:'Try to use 2 phrasal verbs: take off, put on, turn off, calm down, catch up…'}
  ];

  var speakingCards = $('#speakingCards');
  if (speakingCards){
    speakingCards.innerHTML = speakingPrompts.map(function(card, i){
      return '<article class="speaking-card" data-i="' + i + '"><span class="question-pill">' + esc(card.tag) + '</span>'
        + '<h3>' + (i + 1) + '. ' + esc(card.q) + '</h3>'
        + '<button class="listen-btn compact" type="button" data-say="' + esc(card.q) + '">▶ Listen to the question</button>'
        + '<div class="model-buttons"><span class="muted">Model:</span>'
        + ['A2','A2+','B1'].map(function(l){ return '<button class="model-btn" type="button" data-level="' + l + '">' + l + '</button>'; }).join('')
        + '<button class="model-btn" type="button" data-level="hide">Hide</button></div>'
        + '<div class="answer-model" hidden></div>'
        + '<p class="your-turn"><strong>Your turn:</strong> ' + esc(card.turn) + '</p></article>';
    }).join('');
    $all('.speaking-card', speakingCards).forEach(function(cardEl){
      var card = speakingPrompts[+cardEl.getAttribute('data-i')];
      var box = $('.answer-model', cardEl);
      $all('.model-btn', cardEl).forEach(function(btn){
        btn.addEventListener('click', function(){
          $all('.model-btn', cardEl).forEach(function(b){ b.classList.remove('active'); });
          var l = btn.getAttribute('data-level');
          if (l === 'hide'){ box.hidden = true; return; }
          btn.classList.add('active');
          box.hidden = false;
          box.innerHTML = '<strong>' + l + ' model:</strong> ' + esc(card.m[l]) + ' <button class="say-mini" type="button" data-say="' + esc(card.m[l]) + '">🔊</button>';
        });
      });
    });
  }

  /* =========================================================
     10. QUESTION BANK
     ========================================================= */
  var qCols = [
    {title:'🏡 Do / Does (habits)', list:['What do you usually do at the weekend?','Where do you live?','Does your family live near you?','Do you often travel?','What does your partner do?']},
    {title:'🎬 Are you …ing? (now)', list:['What are you doing these days?','Are you reading a good book at the moment?','Is it raining where you are?','Are you working on a project?','What are your children doing now?']},
    {title:'🕰️ Did / Was (past)', list:['What did you do last weekend?','Where did you grow up?','Did you go on holiday this summer?','Was the weather nice?','When did you start teaching?']},
    {title:'🔮 Going to (plans)', list:['What are you going to do this weekend?','Are you going to travel soon?','Where are you going to go next summer?','Is your family going to visit you?','What are you going to cook tonight?']},
    {title:'🧭 Have you ever…?', list:['Have you ever been to Scotland?','Have you ever driven a campervan?','Have you ever lived abroad?','Has your family ever visited France?','What is the best place you have ever visited?']}
  ];
  var qc = $('#questionColumns');
  if (qc){
    qc.innerHTML = qCols.map(function(col){
      return '<article class="question-column"><h3>' + esc(col.title) + '</h3><ul>'
        + col.list.map(function(q){ return '<li><span>' + esc(q) + '</span><button class="say-mini" type="button" data-say="' + esc(q) + '" aria-label="Listen">🔊</button></li>'; }).join('')
        + '</ul></article>';
    }).join('');
  }

  /* =========================================================
     11. WRITING CHECKLIST
     ========================================================= */
  var irregularPast = {get:'got',come:'came',go:'went',take:'took',throw:'threw',put:'put',set:'set',find:'found',grow:'grew',catch:'caught',run:'ran',give:'gave',hang:'hung',wake:'woke',look:'looked',turn:'turned',pick:'picked',drop:'dropped'};
  var pvPatterns = [];
  phrasal.forEach(function(p){
    String(p[2]).split('/').forEach(function(part){
      var words = part.replace(/\(.*?\)/g, '').trim().split(/\s+/);
      if (words.length < 2) return;
      var verb = words[0], rest = words.slice(1).join('\\s+');
      var forms = [verb];
      if (irregularPast[verb]) forms.push(irregularPast[verb]);
      pvPatterns.push(new RegExp('\\b(' + forms.join('|') + ')\\w*\\s+(\\w+\\s+)?' + rest + '\\b', 'i'));
    });
  });
  var checks = [
    {label:'At least 60 words', test:function(t){ return t.split(/\s+/).filter(Boolean).length >= 60; }},
    {label:'A sentence in the past (came, went, was, did…)', test:function(t){ return /\b(yesterday|ago|last|came|went|was|were|did|had|stayed|visited)\b/i.test(t); }},
    {label:'A sentence with he / she + verb-s (she lives, he works…)', test:function(t){ return /\b(he|she|it)\s+(usually\s+|often\s+|always\s+|sometimes\s+|never\s+)?(?!is\b|was\b)[a-z]+s\b/i.test(t); }},
    {label:'A negative (don’t / doesn’t / didn’t)', test:function(t){ return /\b(don['’]t|doesn['’]t|didn['’]t|do not|does not|did not)\b/i.test(t); }},
    {label:'Something happening now (am / is / are + -ing)', test:function(t){ return /\b(am|is|are|['’]m|['’]re|['’]s)\s+(\w+\s+)?\w+ing\b/i.test(t) || /(i['’]m|she['’]s|he['’]s|we['’]re|they['’]re)\s+\w+ing\b/i.test(t); }},
    {label:'A plan with going to', test:function(t){ return /\bgoing to\b/i.test(t); }},
    {label:'A phrasal verb from the lesson', test:function(t){ return pvPatterns.some(function(re){ return re.test(t); }); }},
    {label:'A question for your friend (?)', test:function(t){ return /\?/.test(t); }}
  ];
  var wBox = $('#writingBox'), wList = $('#writingChecklist'), wCount = $('#wordCount');
  function updateChecklist(){
    var t = wBox ? wBox.value : '';
    if (wList) wList.innerHTML = checks.map(function(c){ var ok = c.test(t); return '<li>' + (ok ? '✅' : '⬜') + ' ' + esc(c.label) + '</li>'; }).join('');
    if (wCount) wCount.textContent = t.split(/\s+/).filter(Boolean).length + ' words';
  }
  if (wBox) wBox.addEventListener('input', updateChecklist);
  updateChecklist();

  function copyText(text, msg){
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ alert(msg || 'Copied!'); }).catch(function(){ fallbackCopy(text, msg); });
    } else fallbackCopy(text, msg);
  }
  function fallbackCopy(text, msg){
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); alert(msg || 'Copied!'); } catch(e){ alert(text); }
    document.body.removeChild(ta);
  }
  var cw = $('#copyWriting');
  if (cw) cw.addEventListener('click', function(){
    if (!wBox.value.trim()){ alert('Write your message first.'); return; }
    copyText(wBox.value, 'Message copied!');
  });
  var lw = $('#listenWriting');
  if (lw) lw.addEventListener('click', function(){
    if (!wBox.value.trim()){ alert('Write your message first.'); return; }
    speak(wBox.value);
  });

  /* =========================================================
     12. FINAL MISSION
     ========================================================= */
  var missionPools = [
    {tense:'Present simple · he / she', key:'usually / every… + he / she', items:[
      {q:'Tell me about a friend or a family member. What does he or she do?', m:'My best friend lives in La Rochelle. She works in a school and she loves the sea. She doesn’t like big cities, so she spends a lot of time outside.'},
      {q:'What does a typical weekday look like for you?', m:'I usually get up at 7. I have breakfast, then I go to work. I finish at about 5, and in the evening I cook and relax.'},
      {q:'Describe your town. What is there to do?', m:'My town is quite small but it has a nice market. There is a beach and there are some good restaurants. It doesn’t have a cinema, but it’s very pleasant.'}
    ]},
    {tense:'Present continuous', key:'now / at the moment / these days', items:[
      {q:'What are you doing these days in your free time?', m:'These days, I’m reading a lot and I’m sorting out the photos from my trip. I’m also practising English every week.'},
      {q:'What is happening in your life at the moment?', m:'At the moment, I’m getting back into my routine after the holidays. It’s busy, but I’m trying to keep some time for myself.'}
    ]},
    {tense:'Past simple', key:'yesterday / last… / ago', items:[
      {q:'Tell me about your last holiday.', m:'Last summer, I travelled around France in a campervan. We visited small villages and stayed at campsites. It was relaxing and I loved it.'},
      {q:'What did you do last weekend?', m:'Last weekend, I caught up with a friend. We had lunch together and then we went for a walk by the sea. It was lovely.'},
      {q:'Where did you grow up? What was it like?', m:'I grew up in a small town. It was quiet and I played outside a lot with my friends. I have very good memories.'}
    ]},
    {tense:'Future · going to', key:'next… / tomorrow / soon', items:[
      {q:'What are you going to do next weekend?', m:'Next weekend, I’m going to visit my family. We’re going to have a big lunch together. I’m looking forward to it.'},
      {q:'Do you have any plans for next year?', m:'Yes! Next year, I’m going to travel again. I’m also going to continue my English lessons because I want to speak more easily.'}
    ]},
    {tense:'Present perfect / opinion', key:'ever / never / I prefer… because…', items:[
      {q:'Have you ever travelled abroad? Where?', m:'Yes, I have. I’ve been to Spain and Italy. I went to Italy a few years ago and I loved the food and the people.'},
      {q:'What is the best place you have ever visited? Why?', m:'The best place I’ve ever visited is a little village in the mountains. It was so peaceful, and the view was amazing.'},
      {q:'Do you prefer the sea or the countryside? Why?', m:'I prefer the sea because it’s relaxing and I love walking on the beach. The countryside is nice too, but I need to see the water!'}
    ]}
  ];
  var missionTimers = [];
  function renderMission(){
    missionTimers.forEach(clearInterval); missionTimers = [];
    var wrap = $('#missionSteps'); if (!wrap) return;
    wrap.innerHTML = missionPools.map(function(pool, i){
      var it = pool.items[Math.floor(Math.random() * pool.items.length)];
      return '<article class="mission-step" data-i="' + i + '"><div><span class="step-num">' + (i + 1) + '</span><strong>' + esc(pool.tense) + '</strong></div>'
        + '<p class="step-q">' + esc(it.q) + '</p>'
        + '<p class="muted">🔑 Keywords: ' + esc(pool.key) + '</p>'
        + '<div class="actions-row"><button class="listen-btn compact" type="button" data-say="' + esc(it.q) + '">▶ Listen</button>'
        + '<button class="small-btn" type="button" data-timer>⏱ Start 45 s</button><span class="timer"></span>'
        + '<button class="small-btn" type="button" data-reveal>👁 Model</button></div>'
        + '<div class="reveal">' + esc(it.m) + ' <button class="say-mini" type="button" data-say="' + esc(it.m) + '">🔊</button></div></article>';
    }).join('');
    $all('.mission-step', wrap).forEach(function(step){
      var timerEl = $('.timer', step);
      $('[data-reveal]', step).addEventListener('click', function(){ $('.reveal', step).classList.toggle('show'); });
      $('[data-timer]', step).addEventListener('click', function(){
        var left = 45; timerEl.textContent = '45 s';
        var h = setInterval(function(){
          left--; timerEl.textContent = left > 0 ? left + ' s' : '⏰ Time!';
          if (left <= 0) clearInterval(h);
        }, 1000);
        missionTimers.push(h);
      });
    });
  }
  var nm = $('#newMission'); if (nm) nm.addEventListener('click', renderMission);
  renderMission();

  /* =========================================================
     13. RECORDER
     ========================================================= */
  function setupRecorder(el){
    var supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    el.innerHTML = '<strong>🎙️ Record yourself</strong>'
      + '<button class="rec-start" type="button">● Record</button>'
      + '<button class="rec-stop" type="button" disabled>■ Stop</button>'
      + '<span class="rec-time">0:00</span><span class="rec-status">' + (supported ? 'Click Record and allow the microphone.' : 'Recording is not available in this browser.') + '</span>'
      + '<span class="rec-output"></span>';
    if (!supported){ $('.rec-start', el).disabled = true; return; }
    var startBtn = $('.rec-start', el), stopBtn = $('.rec-stop', el), timeEl = $('.rec-time', el), status = $('.rec-status', el), out = $('.rec-output', el);
    var recorder = null, chunks = [], stream = null, tick = null, secs = 0, lastUrl = null;
    function fmt(s){ return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
    startBtn.addEventListener('click', function(){
      navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){
        stream = s; chunks = [];
        var mime = '';
        ['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/aac'].some(function(m){ if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)){ mime = m; return true; } return false; });
        recorder = mime ? new MediaRecorder(stream, {mimeType:mime}) : new MediaRecorder(stream);
        recorder.ondataavailable = function(e){ if (e.data && e.data.size) chunks.push(e.data); };
        recorder.onstop = function(){
          var type = recorder.mimeType || 'audio/webm';
          var blob = new Blob(chunks, {type:type});
          if (lastUrl) URL.revokeObjectURL(lastUrl);
          lastUrl = URL.createObjectURL(blob);
          var ext = type.indexOf('mp4') !== -1 || type.indexOf('aac') !== -1 ? 'm4a' : 'webm';
          out.innerHTML = '<audio controls src="' + lastUrl + '"></audio> <a class="rec-download" href="' + lastUrl + '" download="my-english-recording.' + ext + '">⬇️ Download</a>';
          status.textContent = 'Listen to yourself. Then try again with one more detail!';
          stream.getTracks().forEach(function(t){ t.stop(); });
        };
        recorder.start();
        secs = 0; timeEl.textContent = '0:00';
        tick = setInterval(function(){ secs++; timeEl.textContent = fmt(secs); }, 1000);
        status.innerHTML = '<span class="rec-dot"></span> Recording…';
        startBtn.disabled = true; stopBtn.disabled = false;
      }).catch(function(){ status.textContent = 'Microphone access was refused. Please allow it in your browser settings.'; });
    });
    stopBtn.addEventListener('click', function(){
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      clearInterval(tick);
      startBtn.disabled = false; stopBtn.disabled = true;
    });
  }
  $all('[data-recorder]').forEach(setupRecorder);

  /* =========================================================
     14. SURVEY + RESULTS
     ========================================================= */
  var surveyItems = ['The lesson was clear','The exercises helped me','I feel more confident speaking','The level was right for me','I enjoyed the topics','The page was easy to use'];
  var sg = $('#surveyGrid');
  if (sg){
    sg.innerHTML = surveyItems.map(function(label, i){
      var stars = '';
      for (var s = 5; s >= 1; s--){
        stars += '<input type="radio" name="sv' + i + '" id="sv' + i + '_' + s + '" value="' + s + '" /><label for="sv' + i + '_' + s + '" title="' + s + ' / 5">★</label>';
      }
      return '<div class="survey-item"><p><strong>' + esc(label) + '</strong></p><div class="stars">' + stars + '</div></div>';
    }).join('');
  }

  function buildResults(){
    var lines = [];
    var d = new Date();
    lines.push('SpeakEasyTisha · Lesson 13 · Back home: everyday life & grammar refresh');
    lines.push('Date: ' + d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}));
    lines.push('');
    var total = 0, good = 0;
    lines.push('EXERCISE SCORES');
    Object.keys(EX).forEach(function(id){
      var arr = STATE[id] || []; var g = arr.filter(Boolean).length;
      total += arr.length; good += g;
      lines.push('- ' + EX[id].title.replace(/^[^A-Za-z]+/, '') + ': ' + g + ' / ' + arr.length);
    });
    lines.push('TOTAL: ' + good + ' / ' + total + ' (' + (total ? Math.round(good / total * 100) : 0) + '%)');
    lines.push('');
    lines.push('SELF-CHECK');
    $all('#selfCheck label').forEach(function(l){
      var cb = $('input', l); lines.push((cb.checked ? '[x] ' : '[ ] ') + l.textContent.trim());
    });
    lines.push('');
    lines.push('SATISFACTION (1 to 5)');
    surveyItems.forEach(function(label, i){
      var sel = $('input[name="sv' + i + '"]:checked');
      lines.push('- ' + label + ': ' + (sel ? sel.value + ' / 5' : 'not answered'));
    });
    lines.push('');
    lines.push('COMMENTS');
    var cb = $('#commentBox'); lines.push(cb && cb.value.trim() ? cb.value.trim() : '—');
    if (wBox && wBox.value.trim()){
      lines.push(''); lines.push('MY WRITING'); lines.push(wBox.value.trim());
    }
    return lines.join('\n');
  }
  var cr = $('#copyResults'); if (cr) cr.addEventListener('click', function(){ copyText(buildResults(), 'Results copied! You can paste them in an email to your teacher.'); });
  var dr = $('#downloadResults');
  if (dr) dr.addEventListener('click', function(){
    var blob = new Blob([buildResults()], {type:'text/plain;charset=utf-8'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lesson-13-results.txt';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });
  var ra = $('#resetAll');
  if (ra) ra.addEventListener('click', function(){
    if (!confirm('Reset all the exercises?')) return;
    Object.keys(EX).forEach(renderBlock);
  });
})();
