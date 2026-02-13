/* SpeakEasyTisha • Valentine’s Day — fully interactive lesson
   - Tap-friendly D&D (tap chip then tap target)
   - SpeechSynthesis US/UK
   - Note builder with copy/speak/save/print
   - Global scoring + localStorage save/load
*/
(() => {
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- Speech ----------
  let currentVoicePref = 'US';
  let voiceCache = [];
  function refreshVoices(){ voiceCache = speechSynthesis.getVoices ? speechSynthesis.getVoices() : []; }
  refreshVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = refreshVoices;

  function pickVoice(){
    if (!voiceCache || !voiceCache.length) return null;
    const want = currentVoicePref === 'UK' ? ['en-GB','en_GB'] : ['en-US','en_US'];
    let v = voiceCache.find(vo => want.some(w => (vo.lang || '').includes(w)));
    if (!v) v = voiceCache.find(vo => (vo.lang || '').toLowerCase().startsWith('en'));
    return v || null;
  }

  function speak(text){
    if (!('speechSynthesis' in window)) return;
    const t = (text || '').trim();
    if (!t) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 1.0;
    u.pitch = 1.0;
    speechSynthesis.speak(u);
  }

  function pauseOrResume(){
    if (!('speechSynthesis' in window)) return;
    if (speechSynthesis.speaking && !speechSynthesis.paused) speechSynthesis.pause();
    else if (speechSynthesis.paused) speechSynthesis.resume();
  }
  function stopSpeak(){
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
  }

  // ---------- Score ----------
  const score = { now:0, max:0, earned:new Set() };
  const scoreNow = () => $('#scoreNow').textContent = String(score.now);
  const scoreMax = () => $('#scoreMax').textContent = String(score.max);
  function bumpMax(points){ score.max += points; scoreMax(); }
  function award(taskId, points){
    if (score.earned.has(taskId)) return false;
    score.earned.add(taskId);
    score.now += points;
    scoreNow();
    return true;
  }
  function resetTask(taskId, points){
    if (!score.earned.has(taskId)) return;
    score.earned.delete(taskId);
    score.now = Math.max(0, score.now - points);
    scoreNow();
  }
  function resetAllScore(){
    score.now = 0; score.max = 0; score.earned.clear();
    scoreNow(); scoreMax();
  }

  // ---------- Data ----------
  const warmups = {
    cute: [
      {icon:'💘', line:'Happy Valentine’s Day, cutie.'},
      {icon:'🥰', line:'You make me smile every day.'},
      {icon:'🍓', line:'I’m lucky to have you.'},
      {icon:'🫶', line:'You’re my favorite person.'},
      {icon:'✨', line:'You’re adorable—never forget it.'},
      {icon:'🌙', line:'I love you to the moon and back.'},
      {icon:'🧸', line:'Come here—you deserve a hug.'},
      {icon:'🎀', line:'You’re the sweetest.'},
    ],
    romantic: [
      {icon:'🌹', line:'Happy Valentine’s Day, my love.'},
      {icon:'💌', line:'I’m so grateful for you.'},
      {icon:'🔥', line:'You make my heart feel safe and alive.'},
      {icon:'🌟', line:'You inspire me to be better.'},
      {icon:'🕯️', line:'Every moment with you feels special.'},
      {icon:'💞', line:'I love the life we’re building together.'},
      {icon:'🫧', line:'You’re my calm in the chaos.'},
      {icon:'🎻', line:'I adore you—deeply.'},
    ],
    funny: [
      {icon:'🍕', line:'I love you more than pizza. (And that’s serious.)'},
      {icon:'😄', line:'You’re my favorite notification.'},
      {icon:'🥐', line:'I’d share my fries with you. That’s love.'},
      {icon:'🧦', line:'You’re the best thing I’ve ever found online.'},
      {icon:'🦖', line:'You’re dino‑mite. (Yes, I said it.)'},
      {icon:'🐝', line:'Bee mine? 🐝'},
      {icon:'🧠', line:'I’m thinking about you. Again.'},
      {icon:'🥳', line:'Happy Valentine’s Day! Please accept my maximum affection.'},
    ],
    classy: [
      {icon:'🥂', line:'Happy Valentine’s Day. You mean the world to me.'},
      {icon:'🌿', line:'Thank you for your kindness and patience.'},
      {icon:'🕊️', line:'I genuinely admire you.'},
      {icon:'🎁', line:'You deserve something beautiful today.'},
      {icon:'🖋️', line:'With all my love, always.'},
      {icon:'📜', line:'I’m grateful for the way you support me.'},
      {icon:'💎', line:'You make life brighter.'},
      {icon:'🌷', line:'I’m proud to be yours.'},
    ]
  };

  const vocab = [
    {theme:'Wishes', icon:'💘', term:'Happy Valentine’s Day!', fr:'Joyeuse Saint‑Valentin !', def:'a Valentine greeting', ex:'Happy Valentine’s Day, my love!'},
    {theme:'Wishes', icon:'💌', term:'I’m thinking of you.', fr:'Je pense à toi.', def:'a sweet message showing affection', ex:'I’m thinking of you today.'},
    {theme:'Wishes', icon:'🫶', term:'I’m grateful for you.', fr:'Je suis reconnaissant(e) pour toi.', def:'you appreciate the person', ex:'I’m grateful for you every day.'},

    {theme:'Feelings', icon:'🥰', term:'affection', fr:'affection', def:'warm feelings of love and caring', ex:'I feel so much affection for you.'},
    {theme:'Feelings', icon:'💞', term:'to adore', fr:'adorer', def:'to love very much (warm)', ex:'I adore you.'},
    {theme:'Feelings', icon:'🌟', term:'to appreciate', fr:'apprécier', def:'to value and be thankful for', ex:'I appreciate everything you do.'},
    {theme:'Feelings', icon:'🔥', term:'to have a crush on', fr:'avoir un crush', def:'to be strongly attracted to someone', ex:'I have a crush on you.'},
    {theme:'Feelings', icon:'🫧', term:'to feel safe', fr:'se sentir en sécurité', def:'to feel protected and calm', ex:'I feel safe with you.'},

    {theme:'Compliments', icon:'✨', term:'thoughtful', fr:'attentionné(e)', def:'kind and carefully considerate', ex:'That was so thoughtful of you.'},
    {theme:'Compliments', icon:'🌸', term:'kind', fr:'gentil(le)', def:'friendly and caring', ex:'You’re so kind.'},
    {theme:'Compliments', icon:'🧠', term:'supportive', fr:'soutenant(e)', def:'helpful and encouraging', ex:'You’re very supportive.'},
    {theme:'Compliments', icon:'💎', term:'amazing', fr:'incroyable', def:'very impressive', ex:'You look amazing.'},
    {theme:'Compliments', icon:'🕊️', term:'genuine', fr:'sincère', def:'real and honest', ex:'Your love is genuine.'},

    {theme:'Gifts', icon:'🌹', term:'bouquet', fr:'bouquet', def:'a bunch of flowers', ex:'I bought you a bouquet.'},
    {theme:'Gifts', icon:'🍫', term:'chocolates', fr:'chocolats', def:'sweet chocolate candies', ex:'I got you chocolates.'},
    {theme:'Gifts', icon:'🎁', term:'a little something', fr:'un petit quelque chose', def:'a small gift', ex:'I got you a little something.'},
    {theme:'Gifts', icon:'💍', term:'jewelry', fr:'bijoux', def:'rings/necklaces/earrings', ex:'She loves simple jewelry.'},
    {theme:'Gifts', icon:'🧸', term:'a keepsake', fr:'souvenir', def:'something to remember a moment', ex:'This photo is a sweet keepsake.'},

    {theme:'Date Night', icon:'🍽️', term:'date night', fr:'soirée en amoureux', def:'a planned romantic evening', ex:'Let’s plan a date night.'},
    {theme:'Date Night', icon:'🕯️', term:'candlelit', fr:'à la lueur des bougies', def:'lit by candles (romantic)', ex:'a candlelit dinner'},
    {theme:'Date Night', icon:'🥂', term:'a toast', fr:'un toast', def:'a short celebratory speech with a drink', ex:'Let’s make a toast.'},
    {theme:'Date Night', icon:'🎬', term:'a cozy night in', fr:'soirée tranquille à la maison', def:'staying home comfortably', ex:'How about a cozy night in?'},
    {theme:'Date Night', icon:'🍰', term:'dessert', fr:'dessert', def:'sweet food at the end of a meal', ex:'Let’s grab dessert.'},

    {theme:'Writing', icon:'🖋️', term:'a love note', fr:'un mot doux', def:'a short romantic message', ex:'I wrote you a love note.'},
    {theme:'Writing', icon:'📜', term:'with all my love', fr:'avec tout mon amour', def:'a romantic closing', ex:'With all my love, Tisha.'},
    {theme:'Writing', icon:'🧷', term:'to mean a lot', fr:'compter beaucoup', def:'to be very important', ex:'You mean a lot to me.'},
    {theme:'Writing', icon:'🫀', term:'from the bottom of my heart', fr:'du fond du cœur', def:'very sincere feeling', ex:'Thank you, from the bottom of my heart.'},
    {theme:'Writing', icon:'🌙', term:'always and forever', fr:'toujours et pour toujours', def:'a strong romantic promise', ex:'Always and forever.'},
  ];

  const inviteBuilder = { chips: ['Would', 'Do', 'on', 'at', 'about', 'so'], answers: ['Would', 'on', 'about'] };

  const quizInvite = [
    { id:'inv1', prompt:'Choose the sweetest invitation:', options:['I want dinner tonight.','Would you like to go out for dinner tonight?','Give me a date night.'], answer:1, explain:'“Would you like…?” is polite + warm.' },
    { id:'inv2', prompt:'Choose the best suggestion:', options:['How about a cozy night in?','We do cozy night in.','You must stay home.'], answer:0, explain:'“How about…?” is natural for suggestions.' },
    { id:'inv3', prompt:'Choose the best polite plan:', options:['Can we go for dessert after?','We go dessert after.','You will go for dessert.'], answer:0, explain:'“Can we…?” is friendly and natural.' },
    { id:'inv4', prompt:'Upgrade this: “I want flowers.”', options:['Could you buy me flowers?','I want flowers right now.','Buy flowers.'], answer:0, explain:'“Could you…?” sounds softer.' },
  ];

  const quizGrateful = [
    { id:'gr1', prompt:'Choose the best:', options:['I am grateful for you because you always support me.','I’m grateful from you.','I have grateful for you.'], answer:0, explain:'Use “grateful for” + because.' },
    { id:'gr2', prompt:'Choose the correct:', options:['We’ve been together since three years.','We’ve been together for three years.','We are together since three years.'], answer:1, explain:'Use “for + duration”.' },
    { id:'gr3', prompt:'Choose the correct:', options:['I’ve loved you since we met.','I love you since we met.','I am loving you since we met.'], answer:0, explain:'Present perfect + since.' },
  ];

  const quizAppropriate = [
    { id:'ap1', prompt:'Text message to your partner (casual):', options:['Happy Valentine’s Day, my love ❤️','Dear Sir or Madam, happy Valentine’s Day.','I demand affection immediately.'], answer:0, explain:'Warm + casual is perfect for a text.' },
    { id:'ap2', prompt:'Card message (classy):', options:['Yo, you’re cute.','With all my love, you mean the world to me.','K thx bye.'], answer:1, explain:'Elegant and heartfelt works best in a card.' },
    { id:'ap3', prompt:'Early relationship (not too intense):', options:['I love you forever.','I really like you, and I’m happy we met.','Marry me.'], answer:1, explain:'Keep it warm, but not too strong.' },
  ];

  const complimentPairs = [
    { compliment:'You’re so thoughtful.', reason:'because you notice the little things.' },
    { compliment:'You’re incredibly kind.', reason:'because you always make time for me.' },
    { compliment:'You’re really supportive.', reason:'because you encourage me when I doubt myself.' },
    { compliment:'You’re amazing.', reason:'because you bring joy to my life.' },
    { compliment:'You’re genuinely inspiring.', reason:'because you never give up.' },
  ];

  const complimentBuilder = {
    intensifiers: ['really', 'so', 'absolutely', 'truly', 'genuinely'],
    adjectives: ['kind', 'thoughtful', 'beautiful', 'handsome', 'supportive', 'funny', 'patient', 'inspiring'],
    reasons: ['because you make me feel safe','because you always support me','because you make me laugh','because you listen to me','because you bring out the best in me','because you’re always there for me']
  };

  const upgradeBasic = ['Happy Valentine’s Day.','I love you.','Thank you for everything.','You are special to me.','Let’s do something tonight.','You look nice.'];
  const upgradeStyles = [
    {id:'cute', label:'Cute (simple + sweet)'},
    {id:'rom', label:'Romantic (warm + deep)'},
    {id:'fun', label:'Funny (playful)'},
    {id:'classy', label:'Classy (elegant)'},
  ];

  function upgradeMessage(basic, style){
    const B = basic.trim();
    const map = {
      cute: [`Happy Valentine’s Day, cutie 💘`,`I love you so much. You’re my favorite.`,`Thanks for being you — seriously.`,`You’re special to me, every single day.`,`How about a cozy night in and dessert?`,`You look amazing today — wow.`],
      rom: [`Happy Valentine’s Day, my love. I’m so grateful for you.`,`I love you — deeply. You make my life brighter.`,`Thank you for everything you do. I notice it, and I appreciate you.`,`You mean the world to me, and I’m proud to be yours.`,`Would you like to do something special tonight?`,`You look absolutely stunning. I can’t stop smiling.`],
      fun: [`Happy Valentine’s Day! I’m sending you maximum affection.`,`I love you more than pizza. That’s real love.`,`Thanks for everything. I promise to share my fries.`,`You’re special to me. Like… “favorite human” special.`,`Let’s do something tonight — dinner, dessert, and chaos?`,`You look nice. Like “I might faint” nice.`],
      classy: [`Happy Valentine’s Day. You mean the world to me.`,`I love you, and I truly admire you.`,`Thank you for your love and your patience. I appreciate you more than you know.`,`You are extraordinary, and I’m grateful we found each other.`,`Would you like to go out for dinner on Friday?`,`You look absolutely wonderful.`],
    };
    const arr = map[style] || map.cute;
    if (/happy valentine/i.test(B)) return arr[0];
    if (/i love you/i.test(B)) return arr[1];
    if (/thank/i.test(B)) return arr[2];
    if (/special/i.test(B)) return arr[3];
    if (/tonight/i.test(B) || /something/i.test(B)) return arr[4];
    if (/look/i.test(B)) return arr[5];
    return arr[0];
  }

  const noteData = {
    tone: [{id:'cute', label:'Cute'},{id:'rom', label:'Romantic'},{id:'fun', label:'Funny'},{id:'classy', label:'Classy'}],
    length: [{id:'text', label:'Short text (1–2 lines)'},{id:'mid', label:'Medium note (4–5 lines)'},{id:'card', label:'Card (elegant)'}],
    focus: ['your kindness','your smile','your support','your strength','your sense of humor','the way you love me','the way you make home feel like home'],
    reason: ['you were there for me when I needed you','you make the little moments feel special','you believe in me','you always listen','you make me feel safe','you bring out the best in me','we laugh together, even on hard days'],
    plan: ['a cozy night in with dessert','a walk and a hot drink','a dinner date and a toast','a movie night and cuddles','a surprise picnic (even at home)','a slow morning and breakfast together'],
    closings: {
      cute: ['Love you!','Big hugs,','Yours,','❤️'],
      rom: ['With all my love,','Forever yours,','Always and forever,','All my love,'],
      fun: ['Love you (a lot).','Your biggest fan,','Fries‑sharing partner,','💘💘💘'],
      classy: ['With all my love,','Yours truly,','Love always,','Forever yours,']
    }
  };

  function buildNote(opts){
    const {tone, length, focus, reason, plan, nameOn, name} = opts;
    const greet = nameOn && name ? `Happy Valentine’s Day, ${name} 💘` : `Happy Valentine’s Day 💘`;
    const compliment = ({cute:`You’re so sweet, and I love ${focus}.`,rom:`You make my life brighter, and I love ${focus}.`,fun:`Just a reminder: I adore you, and I love ${focus}.`,classy:`You mean the world to me, and I truly admire ${focus}.`}[tone] || `You’re wonderful, and I love ${focus}.`);
    const gratitude = ({cute:`I’m grateful for you because ${reason}.`,rom:`I’m so grateful for you because ${reason}.`,fun:`I’m grateful for you because ${reason} (and also because you’re cute).`,classy:`I’m deeply grateful for you because ${reason}.`}[tone] || `I’m grateful for you because ${reason}.`);
    const invite = ({cute:`Would you like ${plan} tonight?`,rom:`Would you like ${plan} tonight? I’d love that with you.`,fun:`How about ${plan}? I promise to be extra charming.`,classy:`Would you like ${plan} this week? I’d love to celebrate you.`}[tone] || `Would you like ${plan} tonight?`);
    const closing = (() => {
      const list = noteData.closings[tone] || noteData.closings.cute;
      const c = list[Math.floor(Math.random()*list.length)];
      return c + (nameOn && name ? `\n— ${name}’s favorite person` : '');
    })();

    if (length === 'text'){
      const line = ({cute:`${greet}\nI’m lucky to have you. ❤️`,rom:`${greet}\nI’m so grateful for you. With all my love.`,fun:`${greet}\nI love you more than pizza. (That’s serious.)`,classy:`${greet}\nYou mean the world to me. With all my love.`}[tone] || `${greet}\nI’m grateful for you.`);
      return line;
    }
    if (length === 'mid'){
      return `${greet}\n\n${compliment}\n${gratitude}\n${invite}\n\n${closing}`;
    }
    const elegant = ({cute:`${greet}\n\nThank you for being you.\n${gratitude}\n\n${invite}\n\n${closing}`,rom:`${greet}\n\nYou make my life better every day.\n${gratitude}\n\n${invite}\n\n${closing}`,fun:`${greet}\n\nI adore you.\n${gratitude}\n\n${invite}\n\n${closing}`,classy:`${greet}\n\nYou are extraordinary.\n${gratitude}\n\n${invite}\n\n${closing}`}[tone] || `${greet}\n\n${gratitude}\n\n${invite}\n\n${closing}`);
    return elegant;
  }

  // Dialogues
  const scenes = [
    { id:'gift', title:'🎁 Exchanging gifts', start:'n1', nodes:{
      n1:{ who:'Partner', text:'Happy Valentine’s Day! I got you a little something.', choices:[
        {mode:'cute', text:'Aww, thank you! You’re the sweetest 💘', next:'n2', points:3},
        {mode:'classy', text:'That’s so thoughtful. Thank you—this means a lot to me.', next:'n2', points:3},
      ]},
      n2:{ who:'Partner', text:'Do you like it?', choices:[
        {mode:'cute', text:'I love it! It’s perfect.', next:'n3', points:3},
        {mode:'classy', text:'I absolutely love it. You have great taste.', next:'n3', points:3},
      ]},
      n3:{ who:'Partner', text:'What would you like to do tonight?', choices:[
        {mode:'cute', text:'How about a cozy night in and dessert?', next:'end', points:3},
        {mode:'classy', text:'Would you like to go out for dinner and make a toast?', next:'end', points:3},
      ]},
      end:{ who:'Partner', text:'That sounds perfect. I love you.', choices:[] }
    }},
    { id:'restaurant', title:'🍽️ Booking a romantic dinner', start:'r1', nodes:{
      r1:{ who:'Host', text:'Hello! How can I help you?', choices:[
        {mode:'cute', text:'Hi! Do you have a table for two tonight?', next:'r2', points:2},
        {mode:'classy', text:'Hi! Would it be possible to book a table for two this evening?', next:'r2', points:3},
      ]},
      r2:{ who:'Host', text:'What time would you like?', choices:[
        {mode:'cute', text:'Around 7, if possible.', next:'r3', points:2},
        {mode:'classy', text:'Around 7 p.m., if you have availability.', next:'r3', points:3},
      ]},
      r3:{ who:'Host', text:'Great. Any preferences?', choices:[
        {mode:'cute', text:'Something cozy, please.', next:'end', points:2},
        {mode:'classy', text:'A quiet table would be wonderful, if possible.', next:'end', points:3},
      ]},
      end:{ who:'Host', text:'Perfect. We’ll see you tonight!', choices:[] }
    }},
    { id:'note', title:'💌 Writing a sweet note together', start:'w1', nodes:{
      w1:{ who:'Partner', text:'What should we write in the card?', choices:[
        {mode:'cute', text:'Let’s keep it simple: “Happy Valentine’s Day, I’m lucky to have you.”', next:'w2', points:3},
        {mode:'classy', text:'Let’s write something heartfelt: gratitude + a memory + a plan.', next:'w2', points:3},
      ]},
      w2:{ who:'Partner', text:'Okay—what’s one thing you love about me?', choices:[
        {mode:'cute', text:'Your smile. It makes my day.', next:'w3', points:3},
        {mode:'classy', text:'Your kindness and the way you support me.', next:'w3', points:3},
      ]},
      w3:{ who:'Partner', text:'And what should we do to celebrate?', choices:[
        {mode:'cute', text:'Dessert and cuddles.', next:'end', points:3},
        {mode:'classy', text:'Dinner and a toast to us.', next:'end', points:3},
      ]},
      end:{ who:'Partner', text:'Perfect. I love that.', choices:[] }
    }},
  ];

  // ---------- Utilities ----------
  function escapeHTML(s){ return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function escapeHTMLAttr(s){ return escapeHTML(s).replace(/"/g,'&quot;'); }

  // ---------- Voice wiring ----------
  function wireVoice(){
    const us = $('#voiceUS');
    const uk = $('#voiceUK');
    const set = (v) => {
      currentVoicePref = v;
      us.classList.toggle('is-active', v==='US');
      uk.classList.toggle('is-active', v==='UK');
      us.setAttribute('aria-pressed', v==='US' ? 'true' : 'false');
      uk.setAttribute('aria-pressed', v==='UK' ? 'true' : 'false');
      speak(v==='US' ? 'US voice selected.' : 'UK voice selected.');
    };
    us.addEventListener('click', () => set('US'));
    uk.addEventListener('click', () => set('UK'));

    $('#btnPause').addEventListener('click', pauseOrResume);
    $('#btnStop').addEventListener('click', stopSpeak);

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.speak');
      if (!btn) return;
      speak(btn.getAttribute('data-say') || btn.textContent);
    });

    $('#btnListenMission').addEventListener('click', () => {
      speak('Today’s mission: wish your partner a happy Valentine’s Day, use warm compliments, write sweet notes, and make polite romantic plans.');
    });
    $('#btnLoveRapid').addEventListener('click', () => {
      const lines = [
        'Happy Valentine’s Day, my love.',
        'I’m so grateful for you.',
        'You make my life better every day.',
        'Would you like to do something special tonight?',
        'You’re so thoughtful.',
        'With all my love.'
      ];
      speak(lines.join(' '));
    });
  }

  // ---------- Warmup ----------
  function initWarmup(){
    const vibeSel = $('#warmVibe');
    const playBtn = $('#warmPlay');
    const shufBtn = $('#warmShuffle');
    const host = $('#warmCards');
    const msg = $('#warmMsg');

    vibeSel.innerHTML = '';
    const vibes = [
      {id:'cute', label:'Cute'},
      {id:'romantic', label:'Romantic'},
      {id:'funny', label:'Funny'},
      {id:'classy', label:'Classy'}
    ];
    vibes.forEach(v => {
      const o = document.createElement('option');
      o.value = v.id; o.textContent = v.label;
      vibeSel.appendChild(o);
    });
    vibeSel.value = 'romantic';

    function render(){
      host.innerHTML = '';
      const items = warmups[vibeSel.value] || warmups.romantic;
      items.slice(0, 8).forEach(w => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card__top">
            <div>
              <div class="card__title">${escapeHTML(w.line)}</div>
              <div class="card__meta">${escapeHTML(vibeSel.options[vibeSel.selectedIndex].textContent)} vibe</div>
            </div>
            <div class="card__icon">${w.icon}</div>
          </div>
          <div class="card__footer">
            <span class="flipHint">Tap 🔊 and repeat</span>
            <button class="chip speak" data-say="${escapeHTMLAttr(w.line)}" type="button">🔊</button>
          </div>
        `;
        host.appendChild(card);
      });
      msg.textContent = 'Tap any 🔊 and repeat twice.';
      msg.className = 'pill';
    }

    function play(){
      const items = shuffle(warmups[vibeSel.value] || warmups.romantic).slice(0, 6);
      speak(items.map(x => x.line).join(' '));
      award('warm_play', 4);
      msg.textContent = '✅ Nice! Repeat again and exaggerate the stress.';
      msg.className = 'pill good';
    }

    playBtn.addEventListener('click', play);
    shufBtn.addEventListener('click', () => render());
    vibeSel.addEventListener('change', render);

    bumpMax(4);
    render();
  }

  // ---------- Vocab ----------
  function initVocab(){
    const themeSel = $('#vocabTheme');
    const search = $('#vocabSearch');
    const showEx = $('#vocabExamples');
    const grid = $('#vocabGrid');

    themeSel.innerHTML = '<option value="all">All themes</option>';
    const themes = ['all', ...Array.from(new Set(vocab.map(v => v.theme)))];
    themes.forEach(t => {
      if (t === 'all') return;
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      themeSel.appendChild(opt);
    });

    function render(items){
      grid.innerHTML = '';
      items.forEach(v => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'card';
        card.setAttribute('data-flipped','0');
        card.innerHTML = `
          <div class="card__top">
            <div>
              <div class="card__title">${escapeHTML(v.term)}</div>
              <div class="card__meta">${escapeHTML(v.theme)}</div>
            </div>
            <div class="card__icon" aria-hidden="true">${v.icon}</div>
          </div>
          <div class="card__body">
            <div class="front">
              <div class="muted">Tap to flip.</div>
              ${showEx.checked ? `<div class="ex"><strong>Example:</strong> ${escapeHTML(v.ex)}</div>` : ''}
            </div>
            <div class="back hidden">
              <div><strong>Meaning:</strong> ${escapeHTML(v.def)}</div>
              ${showEx.checked ? `<div class="fr"><strong>FR:</strong> ${escapeHTML(v.fr)}</div>` : ''}
              ${showEx.checked ? `<div class="ex"><strong>Example:</strong> ${escapeHTML(v.ex)}</div>` : ''}
            </div>
          </div>
          <div class="card__footer">
            <span class="flipHint">${showEx.checked ? 'Tap to flip • FR + example shown' : 'Tap to flip'}</span>
            <span class="chips"><button class="chip speak" data-say="${escapeHTMLAttr(v.term)}" type="button">🔊</button></span>
          </div>
        `;
        card.addEventListener('click', (e) => {
          const chip = e.target.closest('.chip');
          if (chip && chip.classList.contains('speak')) return;
          const flipped = card.getAttribute('data-flipped') === '1';
          card.setAttribute('data-flipped', flipped ? '0' : '1');
          const front = $('.front', card);
          const back = $('.back', card);
          if (front && back){
            front.classList.toggle('hidden', !flipped);
            back.classList.toggle('hidden', flipped);
          }
        });
        grid.appendChild(card);
      });
    }

    function filter(){
      const t = themeSel.value;
      const q = (search.value || '').trim().toLowerCase();
      const items = vocab.filter(v => {
        const okTheme = (t==='all') || v.theme === t;
        const okSearch = !q || [v.term, v.def, v.fr, v.theme].join(' ').toLowerCase().includes(q);
        return okTheme && okSearch;
      });
      render(items);
    }

    themeSel.addEventListener('change', filter);
    search.addEventListener('input', filter);
    showEx.addEventListener('change', filter);

    $('#btnVocabReset').addEventListener('click', () => {
      themeSel.value = 'all';
      search.value = '';
      showEx.checked = false;
      filter();
    });

    $('#btnVocabRandom').addEventListener('click', () => {
      render(shuffle(vocab).slice(0, 6));
      award('vocab_random', 2);
    });

    bumpMax(2);
    filter();
  }

  // ---------- Quiz ----------
  function renderQuiz(targetId, items, pointsPerItem=2){
    const host = $(`#${CSS.escape(targetId)} .quiz__body`) || $(`#${CSS.escape(targetId)}`);
    if (!host) return;
    bumpMax(items.length * pointsPerItem);
    host.innerHTML = '';

    items.forEach(q => {
      const card = document.createElement('div');
      card.className = 'qCard';
      card.dataset.answered = '0';
      card.innerHTML = `
        <div class="qPrompt">${escapeHTML(q.prompt)}</div>
        <div class="qOptions"></div>
        <div class="qFeedback"></div>
      `;
      const optWrap = $('.qOptions', card);
      const fb = $('.qFeedback', card);

      const opts = shuffle(q.options.map((t, idx) => ({t, idx})));
      opts.forEach(o => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.textContent = o.t;
        b.addEventListener('click', () => {
          if (card.dataset.answered === '1') return;
          const isCorrect = o.idx === q.answer;
          card.dataset.answered = '1';
          $$('.opt', optWrap).forEach(btn => btn.disabled = true);
          b.classList.add(isCorrect ? 'correct' : 'wrong');
          const correctText = q.options[q.answer];
          const correctBtn = $$('.opt', optWrap).find(x => x.textContent === correctText);
          if (correctBtn) correctBtn.classList.add('correct');
          fb.textContent = (isCorrect ? '✅ ' : '❌ ') + q.explain;
          if (isCorrect) award(`quiz_${q.id}`, pointsPerItem);
        });
        optWrap.appendChild(b);
      });

      host.appendChild(card);
    });
  }

  function resetQuiz(targetId, items, pointsPerItem=2){
    items.forEach(q => resetTask(`quiz_${q.id}`, pointsPerItem));
    renderQuiz(targetId, items, pointsPerItem);
  }

  function wireQuizResetButtons(){
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-quiz-reset]');
      if (!btn) return;
      const id = btn.getAttribute('data-quiz-reset');
      if (id === 'quiz-invite') resetQuiz('quiz-invite', quizInvite);
      if (id === 'quiz-grateful') resetQuiz('quiz-grateful', quizGrateful);
      if (id === 'quiz-appropriate') resetQuiz('quiz-appropriate', quizAppropriate);
    });
  }

  // ---------- Builder: invitations ----------
  function initInviteBuilder(){
    const root = $('#builder-invite');
    const blanks = $$('.blank', root);
    const bank = $('.chipBank', root);
    const msg = $('#builder-invite-msg');
    const checkBtn = $('#builder-invite-check');
    const resetBtn = $('#builder-invite-reset');
    const sayBtn = $('#builder-invite-say');

    let activeBlank = 0;
    let filled = new Array(inviteBuilder.answers.length).fill('');

    function setActive(i){
      activeBlank = i;
      blanks.forEach(b => b.classList.toggle('is-active', Number(b.dataset.blank) === i));
    }
    blanks.forEach(b => b.addEventListener('click', () => setActive(Number(b.dataset.blank))));

    function renderBank(){
      bank.innerHTML = '';
      shuffle(inviteBuilder.chips).forEach(ch => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip';
        btn.textContent = ch;
        btn.addEventListener('click', () => {
          filled[activeBlank] = ch;
          blanks[activeBlank].textContent = ch;
          setActive(clamp(activeBlank+1, 0, filled.length-1));
        });
        bank.appendChild(btn);
      });
    }

    function reset(){
      filled = new Array(inviteBuilder.answers.length).fill('');
      blanks.forEach(b => b.textContent = '_____');
      setActive(0);
      msg.textContent = '';
      msg.className = 'pill';
      renderBank();
    }

    function check(){
      let ok = 0;
      for (let i=0;i<inviteBuilder.answers.length;i++){
        if ((filled[i]||'').trim().toLowerCase() === inviteBuilder.answers[i].toLowerCase()) ok++;
      }
      if (ok === inviteBuilder.answers.length){
        msg.textContent = `✅ Perfect! (${ok}/${inviteBuilder.answers.length})`;
        msg.className = 'pill good';
        award('g1_builder', 6);
      } else {
        msg.textContent = `Almost: ${ok}/${inviteBuilder.answers.length}. Hint: Would / on / about`;
        msg.className = 'pill warn';
      }
    }

    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => { resetTask('g1_builder', 6); reset(); });
    sayBtn.addEventListener('click', () => {
      const sent = `${filled[0]||'___'} you like to go out for dinner ${filled[1]||'___'} Friday? How ${filled[2]||'___'} a movie after?`;
      speak(sent);
    });

    bumpMax(6);
    reset();
  }

  // ---------- Compliments tap-match ----------
  function initComplimentDD(){
    const bank = $('#dd-compliments .dd__bank');
    const zoneItems = $('#dd-compliments .dropzone__items');
    const msg = $('#dd-compliments-msg');
    const checkBtn = $('#dd-compliments-check');
    const resetBtn = $('#dd-compliments-reset');

    let selected = null;
    let pairs = shuffle(complimentPairs).map((p, i) => ({...p, id:`cp_${i}`}));

    function makeChip(txt, kind, id, pid){
      const el = document.createElement('div');
      el.className = 'ddCard';
      el.textContent = txt;
      el.dataset.kind = kind; // 'c' or 'r'
      el.dataset.id = id;
      el.dataset.pid = pid;
      el.setAttribute('draggable','true');
      el.tabIndex = 0;

      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', id);
      });

      const selectMe = () => {
        if (selected) selected.classList.remove('is-selected');
        selected = el;
        el.classList.add('is-selected');
        msg.textContent = `Selected: ${txt} → tap the matching piece.`;
        msg.className = 'pill';
      };

      el.addEventListener('click', selectMe);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMe(); }
      });

      return el;
    }

    function render(){
      bank.innerHTML = '';
      zoneItems.innerHTML = '';
      selected = null;
      msg.textContent = '';
      msg.className = 'pill';

      const mixed = [];
      pairs.forEach(p => {
        mixed.push({txt:p.compliment, kind:'c', pid:p.id});
        mixed.push({txt:p.reason, kind:'r', pid:p.id});
      });

      shuffle(mixed).forEach(item => {
        bank.appendChild(makeChip(item.txt, item.kind, `${item.pid}_${item.kind}`, item.pid));
      });
    }

    bank.addEventListener('click', (e) => {
      const chip = e.target.closest('.ddCard');
      if (!chip || !selected || chip === selected) return;

      const a = selected;
      const b = chip;

      const samePair = a.dataset.pid === b.dataset.pid;
      const differentKind = a.dataset.kind !== b.dataset.kind;

      if (samePair && differentKind){
        const pid = a.dataset.pid;
        const c = a.dataset.kind === 'c' ? a : b;
        const r = a.dataset.kind === 'r' ? a : b;

        const group = document.createElement('div');
        group.className = 'ddCard';
        group.style.borderStyle = 'dashed';
        group.style.display = 'flex';
        group.style.gap = '8px';
        group.style.flexWrap = 'wrap';
        group.dataset.pid = pid;
        group.innerHTML = `<span>✅ ${escapeHTML(c.textContent)}</span><span class="muted">(${escapeHTML(r.textContent)})</span>`;
        zoneItems.appendChild(group);

        c.remove(); r.remove();
        selected.classList.remove('is-selected');
        selected = null;

        msg.textContent = 'Nice match! Keep going.';
        msg.className = 'pill good';
      } else if (differentKind) {
        msg.textContent = 'Not a match — try a different reason.';
        msg.className = 'pill warn';
      }
    });

    const zone = $('#dd-compliments .dropzone');
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('is-target'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('is-target'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault(); zone.classList.remove('is-target');
      const id = e.dataTransfer.getData('text/plain');
      const el = bank.querySelector(`[data-id="${CSS.escape(id)}"]`);
      if (el) zoneItems.appendChild(el);
      msg.textContent = 'Dropped. (Tip: match a compliment with its reason.)';
      msg.className = 'pill';
    });

    function check(){
      const matched = $$('.dropzone__items [data-pid]', zone).length;
      if (matched === pairs.length){
        msg.textContent = `✅ Perfect! ${matched}/${pairs.length} matched.`;
        msg.className = 'pill good';
        award('g2_dd', 8);
      } else {
        msg.textContent = `Keep going: ${matched}/${pairs.length} matched.`;
        msg.className = 'pill warn';
      }
    }

    function reset(){
      resetTask('g2_dd', 8);
      pairs = shuffle(complimentPairs).map((p, i) => ({...p, id:`cp_${i}`}));
      render();
    }

    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', reset);

    bumpMax(8);
    render();
  }

  function addOpt(sel, txt){
    const o = document.createElement('option');
    o.value = txt;
    o.textContent = txt;
    sel.appendChild(o);
  }

  // ---------- Compliment dropdown builder ----------
  function initComplimentBuilder(){
    const intSel = $('#cb-int');
    const adjSel = $('#cb-adj');
    const reaSel = $('#cb-reason');
    const out = $('#cb-out');
    const msg = $('#cb-msg');

    intSel.innerHTML = ''; adjSel.innerHTML=''; reaSel.innerHTML='';
    complimentBuilder.intensifiers.forEach(x => addOpt(intSel, x));
    complimentBuilder.adjectives.forEach(x => addOpt(adjSel, x));
    complimentBuilder.reasons.forEach(x => addOpt(reaSel, x));

    function generate(){
      const s = `You’re ${intSel.value} ${adjSel.value}, ${reaSel.value}.`;
      out.textContent = s;
      msg.textContent = 'Generated!';
      msg.className = 'pill good';
    }

    $('#cb-generate').addEventListener('click', generate);
    $('#cb-say').addEventListener('click', () => speak(out.textContent));
    $('#cb-copy').addEventListener('click', async () => {
      const t = out.textContent.trim();
      if (!t) return;
      try{
        await navigator.clipboard.writeText(t);
        msg.textContent = 'Copied ✔';
        msg.className = 'pill good';
        award('g2_copy', 4);
      }catch{
        msg.textContent = 'Copy failed (browser).';
        msg.className = 'pill warn';
      }
    });

    bumpMax(4);
    generate();
  }

  // ---------- Upgrade machine ----------
  function initUpgrade(){
    const basicSel = $('#up-basic');
    const styleSel = $('#up-style');
    const out = $('#up-out');
    const msg = $('#up-msg');

    basicSel.innerHTML = '';
    upgradeBasic.forEach(x => addOpt(basicSel, x));

    styleSel.innerHTML = '';
    upgradeStyles.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.label;
      styleSel.appendChild(o);
    });
    styleSel.value = 'rom';

    function generate(){
      const styleMap = {cute:'cute', rom:'rom', fun:'fun', classy:'classy'};
      const s = upgradeMessage(basicSel.value, styleMap[styleSel.value] || 'cute');
      out.textContent = s;
      msg.textContent = 'Upgraded!';
      msg.className = 'pill good';
      award('upgrade_gen', 3);
    }

    $('#up-generate').addEventListener('click', generate);
    $('#up-say').addEventListener('click', () => speak(out.textContent));
    $('#up-copy').addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(out.textContent);
        msg.textContent = 'Copied ✔';
        msg.className = 'pill good';
        award('upgrade_copy', 3);
      }catch{
        msg.textContent = 'Copy failed.';
        msg.className = 'pill warn';
      }
    });

    bumpMax(3); bumpMax(3);
    generate();

    renderQuiz('quiz-appropriate', quizAppropriate, 2);
  }

  // ---------- Dialogues ----------
  function initDialogues(){
    const sceneSel = $('#dlgScene');
    const cuteBtn = $('#dlgCute');
    const classyBtn = $('#dlgClassy');
    const restartBtn = $('#dlgRestart');
    const readLastBtn = $('#dlgReadLast');
    const log = $('#dlgLog');
    const choices = $('#dlgChoices');
    const msg = $('#dlgMsg');

    let mode = 'cute';
    let scene = scenes[0];
    let nodeId = scene.start;
    let lastLine = '';

    sceneSel.innerHTML = '';
    scenes.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.title;
      sceneSel.appendChild(o);
    });

    function setMode(m){
      mode = m;
      cuteBtn.classList.toggle('is-active', m==='cute');
      classyBtn.classList.toggle('is-active', m==='classy');
      cuteBtn.setAttribute('aria-pressed', m==='cute' ? 'true' : 'false');
      classyBtn.setAttribute('aria-pressed', m==='classy' ? 'true' : 'false');
      msg.textContent = m==='cute' ? 'Cute mode: simple + sweet.' : 'Classy mode: elegant + polite.';
      msg.className = 'pill';
    }

    function bubble(who, text, isYou=false){
      const b = document.createElement('div');
      b.className = 'bubble' + (isYou ? ' you' : '');
      b.innerHTML = `<span class="who">${escapeHTML(who)}</span><span class="txt">${escapeHTML(text)}</span>`;
      return b;
    }

    function renderNode(){
      choices.innerHTML = '';
      const node = scene.nodes[nodeId];
      if (!node) return;

      log.appendChild(bubble(node.who, node.text, false));
      lastLine = node.text;
      log.scrollTop = log.scrollHeight;

      const nodeChoices = (node.choices || []).filter(c => c.mode === mode);
      if (!nodeChoices.length){
        choices.innerHTML = `<span class="muted">Scene complete. Try the other mode!</span>`;
        msg.textContent = '✅ Done. Restart or switch mode for extra points.';
        msg.className = 'pill good';
        award(`dlg_${scene.id}_${mode}`, 6);
        return;
      }

      nodeChoices.forEach(c => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opt';
        btn.textContent = c.text;
        btn.addEventListener('click', () => {
          log.appendChild(bubble('You', c.text, true));
          lastLine = c.text;
          log.scrollTop = log.scrollHeight;
          award(`dlgline_${scene.id}_${mode}_${nodeId}`, c.points || 2);
          nodeId = c.next;
          renderNode();
        });
        choices.appendChild(btn);
      });
    }

    function restart(){
      log.innerHTML = '';
      nodeId = scene.start;
      msg.textContent = 'Pick replies. Use 🔊 to listen.';
      msg.className = 'pill';
      renderNode();
    }

    function setScene(id){
      scene = scenes.find(s => s.id === id) || scenes[0];
      restart();
    }

    cuteBtn.addEventListener('click', () => setMode('cute'));
    classyBtn.addEventListener('click', () => setMode('classy'));
    sceneSel.addEventListener('change', () => setScene(sceneSel.value));
    restartBtn.addEventListener('click', restart);
    readLastBtn.addEventListener('click', () => speak(lastLine));

    bumpMax(6 * scenes.length * 2);
    bumpMax(40);
    setMode('cute');
    setScene(scenes[0].id);
  }

  // ---------- Notes builder ----------
  function initNotes(){
    const toneSel = $('#note-tone');
    const lenSel = $('#note-length');
    const focusSel = $('#note-focus');
    const reaSel = $('#note-reason');
    const planSel = $('#note-plan');
    const nameOn = $('#note-name-on');
    const nameIn = $('#note-name');

    const out = $('#note-out');
    const msg = $('#note-msg');
    const savedHost = $('#savedNotes');

    let saved = [];

    toneSel.innerHTML = '';
    noteData.tone.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id; o.textContent = t.label;
      toneSel.appendChild(o);
    });
    lenSel.innerHTML = '';
    noteData.length.forEach(l => {
      const o = document.createElement('option');
      o.value = l.id; o.textContent = l.label;
      lenSel.appendChild(o);
    });
    focusSel.innerHTML=''; noteData.focus.forEach(x => addOpt(focusSel, x));
    reaSel.innerHTML=''; noteData.reason.forEach(x => addOpt(reaSel, x));
    planSel.innerHTML=''; noteData.plan.forEach(x => addOpt(planSel, x));

    toneSel.value = 'rom';
    lenSel.value = 'mid';
    focusSel.value = 'your kindness';
    reaSel.value = 'you make the little moments feel special';
    planSel.value = 'a dinner date and a toast';
    nameOn.checked = false;
    nameIn.value = '';

    function renderSaved(){
      savedHost.innerHTML = '';
      saved.forEach((t, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'savedPill';
        b.textContent = `⭐ Note ${i+1}`;
        b.title = t;
        b.addEventListener('click', () => {
          out.textContent = t;
          msg.textContent = `Loaded saved note ${i+1}.`;
          msg.className = 'pill good';
        });
        savedHost.appendChild(b);
      });
      if (!saved.length) savedHost.innerHTML = `<span class="muted">No saved notes yet.</span>`;
    }

    function generate(){
      const text = buildNote({
        tone: toneSel.value,
        length: lenSel.value,
        focus: focusSel.value,
        reason: reaSel.value,
        plan: planSel.value,
        nameOn: nameOn.checked,
        name: (nameIn.value || '').trim()
      });
      out.textContent = text;
      msg.textContent = 'Generated!';
      msg.className = 'pill good';
      award('note_generate', 6);
    }

    async function copy(){
      try{
        await navigator.clipboard.writeText(out.textContent);
        msg.textContent = 'Copied ✔';
        msg.className = 'pill good';
        award('note_copy', 4);
      }catch{
        msg.textContent = 'Copy failed (browser).';
        msg.className = 'pill warn';
      }
    }

    function save(){
      const t = out.textContent.trim();
      if (!t) return;
      if (!saved.includes(t)) saved.unshift(t);
      saved = saved.slice(0, 10);
      renderSaved();
      msg.textContent = 'Saved ⭐';
      msg.className = 'pill good';
      award('note_save', 4);
    }

    function clear(){
      out.textContent = '';
      msg.textContent = '';
      msg.className = 'pill';
    }

    $('#note-generate').addEventListener('click', generate);
    $('#note-clear').addEventListener('click', clear);
    $('#note-say').addEventListener('click', () => speak(out.textContent));
    $('#note-copy').addEventListener('click', copy);
    $('#note-save').addEventListener('click', save);
    $('#note-print').addEventListener('click', () => window.print());

    [toneSel, lenSel, focusSel, reaSel, planSel, nameOn].forEach(el => el.addEventListener('change', generate));
    bumpMax(6); bumpMax(4); bumpMax(4);
    generate();
    renderSaved();
  }

  // ---------- Final challenge ----------
  function initFinal(){
    const txt = $('#final-text');
    const msg = $('#final-msg');
    const sweetChipsHost = $('#sweetChips');
    const sweetOut = $('#sweetOut');
    const sweetMsg = $('#sweetMsg');

    const chips = ['Happy Valentine’s Day','I’m grateful for you','You mean the world to me','because','Would you like to','With all my love','I adore you','You make my life better','I genuinely admire you','always'];

    function renderChips(){
      sweetChipsHost.innerHTML = '';
      chips.forEach(c => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.textContent = c;
        b.addEventListener('click', () => {
          const cur = txt.value.trim();
          txt.value = (cur ? cur + ' ' : '') + c;
          award('final_chip', 2);
        });
        sweetChipsHost.appendChild(b);
      });
    }

    function check(){
      const t = (txt.value || '').trim();
      let ok = 0;
      if (/happy valentine/i.test(t)) ok++;
      if (/\byou(’|')?re\b|\byou are\b|\byou mean\b/i.test(t)) ok++;
      if (/\bbecause\b/i.test(t)) ok++;
      if (/\bwould you like\b|\bhow about\b|\bcould we\b/i.test(t)) ok++;
      if (/\bwith all my love\b|\blove always\b|\bforever yours\b|\byours\b/i.test(t)) ok++;

      if (ok >= 4){
        msg.textContent = `✅ Excellent! You included ${ok}/5 ingredients.`;
        msg.className = 'pill good';
        award('final_check', 8);
      } else {
        msg.textContent = `Almost: ${ok}/5 ingredients. Add “because”, an invitation, and a closing.`;
        msg.className = 'pill warn';
      }
    }

    async function copy(){
      try{
        await navigator.clipboard.writeText(txt.value);
        msg.textContent = 'Copied ✔';
        msg.className = 'pill good';
        award('final_copy', 4);
      }catch{
        msg.textContent = 'Copy failed.';
        msg.className = 'pill warn';
      }
    }

    function clear(){
      txt.value = '';
      msg.textContent = '';
      msg.className = 'pill';
    }

    const upgradeBits = ['You’re so thoughtful.','I’m grateful for you.','You make my life better every day.','I genuinely admire you.','Would you like to celebrate tonight?','With all my love,'];
    function sweetGen(){
      sweetOut.textContent = shuffle(upgradeBits).slice(0, 4).join(' ');
      sweetMsg.textContent = 'Upgraded message generated.';
      sweetMsg.className = 'pill good';
      award('sweet_gen', 4);
    }

    $('#final-check').addEventListener('click', check);
    $('#final-clear').addEventListener('click', clear);
    $('#final-say').addEventListener('click', () => speak(txt.value));
    $('#final-copy').addEventListener('click', copy);

    $('#sweetGen').addEventListener('click', sweetGen);
    $('#sweetSay').addEventListener('click', () => speak(sweetOut.textContent));

    bumpMax(2); bumpMax(8); bumpMax(4); bumpMax(4);
    renderChips();
    sweetGen();
  }

  function wirePrint(){ $('#btnPrintNotes').addEventListener('click', () => window.print()); }

  function wireSectionListenReset(){
    const listenText = {
      g1: 'Polite invitations: Would you like…? How about…? Could we…? They sound warm and natural.',
      g2: 'Compliments: You are plus an adjective, with an intensifier like really, so, or absolutely. Add because for a reason.',
      g3: 'Gratitude language: I’m grateful for you because… Use present perfect with since and for.'
    };

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-listen]');
      if (btn){
        const id = btn.getAttribute('data-listen');
        speak(listenText[id] || '');
      }
      const r = e.target.closest('[data-reset]');
      if (r){
        const id = r.getAttribute('data-reset');
        resetSection(id);
      }
    });
  }

  function resetSection(id){
    if (id === 'g1'){
      quizInvite.forEach(q => resetTask(`quiz_${q.id}`, 2));
      resetTask('g1_builder', 6);
      resetQuiz('quiz-invite', quizInvite);
      $('#builder-invite-reset').click();
    }
    if (id === 'g2'){
      resetTask('g2_dd', 8);
      resetTask('g2_copy', 4);
      $('#dd-compliments-reset').click();
      initComplimentBuilder();
    }
    if (id === 'g3'){
      quizGrateful.forEach(q => resetTask(`quiz_${q.id}`, 2));
      resetQuiz('quiz-grateful', quizGrateful);
    }
  }

  function wireProgress(){
    const key = 'speakeasy_valentines_notes_v1';

    $('#btnSaveProgress').addEventListener('click', () => {
      const data = {
        scoreNow: score.now,
        scoreMax: score.max,
        earned: Array.from(score.earned),
        voice: currentVoicePref,
        noteOut: $('#note-out') ? $('#note-out').textContent : '',
        finalText: $('#final-text') ? $('#final-text').value : ''
      };
      try{
        localStorage.setItem(key, JSON.stringify(data));
        speak('Progress saved.');
      }catch{}
    });

    $('#btnLoadProgress').addEventListener('click', () => {
      try{
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const data = JSON.parse(raw);

        score.now = Number(data.scoreNow) || 0;
        score.max = Number(data.scoreMax) || score.max;
        score.earned = new Set(Array.isArray(data.earned) ? data.earned : []);
        scoreNow(); scoreMax();

        currentVoicePref = data.voice === 'UK' ? 'UK' : 'US';
        $('#voiceUS').classList.toggle('is-active', currentVoicePref==='US');
        $('#voiceUK').classList.toggle('is-active', currentVoicePref==='UK');
        $('#voiceUS').setAttribute('aria-pressed', currentVoicePref==='US' ? 'true' : 'false');
        $('#voiceUK').setAttribute('aria-pressed', currentVoicePref==='UK' ? 'true' : 'false');

        if ($('#note-out') && typeof data.noteOut === 'string') $('#note-out').textContent = data.noteOut;
        if ($('#final-text') && typeof data.finalText === 'string') $('#final-text').value = data.finalText;

        speak('Progress loaded.');
      }catch{}
    });

    $('#btnClearProgress').addEventListener('click', () => {
      try{ localStorage.removeItem(key); }catch{}
      speak('Saved progress cleared.');
    });
  }

  function wireResetAll(){
    $('#btnResetAll').addEventListener('click', () => {
      stopSpeak();
      resetAllScore();

      initWarmup();
      initVocab();
      renderQuiz('quiz-invite', quizInvite, 2);
      initInviteBuilder();
      initComplimentDD();
      initComplimentBuilder();
      renderQuiz('quiz-grateful', quizGrateful, 2);
      initUpgrade();
      initDialogues();
      initNotes();
      initFinal();

      speak('Lesson reset.');
    });
  }

  function init(){
    document.documentElement.style.scrollBehavior = 'smooth';
    wireVoice();
    wirePrint();
    wireQuizResetButtons();
    wireSectionListenReset();
    wireProgress();
    wireResetAll();

    initWarmup();
    initVocab();
    renderQuiz('quiz-invite', quizInvite, 2);
    initInviteBuilder();
    initComplimentDD();
    initComplimentBuilder();
    renderQuiz('quiz-grateful', quizGrateful, 2);
    initUpgrade();
    initDialogues();
    initNotes();
    initFinal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();