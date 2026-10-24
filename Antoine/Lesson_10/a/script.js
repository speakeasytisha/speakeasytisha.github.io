'use strict';
/* SpeakEasyTisha · Antoine · HYROX Geneva Race Replay */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
};

/* ---------- Progress registry (every check on the page counts) ---------- */
const registry = new Set();
const results = {};
function register(key){ registry.add(key); }
function mark(key, ok){ results[key] = ok; updateProgress(); }
function updateProgress(){
  const total = registry.size;
  const ok = Object.values(results).filter(Boolean).length;
  $('#count').textContent = `${ok} / ${total} checked exercises correct`;
  $('#bar').style.width = total ? (ok / total * 100) + '%' : '0';
}

/* ---------- Speech: chosen accent, never a French voice, no autoplay ---------- */
let voices = [];
function loadVoices(){ if ('speechSynthesis' in window) voices = speechSynthesis.getVoices(); }
if ('speechSynthesis' in window){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function pickVoice(lang){
  const norm = v => v.lang.replace('_','-').toLowerCase();
  const exact = voices.filter(v => norm(v) === lang.toLowerCase());
  const best = list => list.find(v => /natural|neural|google|enhanced|premium|siri/i.test(v.name)) || list[0];
  if (exact.length) return { voice: best(exact), fallback: false };
  const en = voices.filter(v => norm(v).startsWith('en'));
  if (en.length) return { voice: best(en.filter(v => norm(v) === 'en-gb')) || best(en), fallback: true };
  return { voice: null, fallback: true };
}
function speak(text, onEnd){
  if (!('speechSynthesis' in window)){ $('#voiceNote').textContent = 'Audio is not available in this browser.'; return; }
  speechSynthesis.cancel();
  const lang = $('#accent').value;
  const { voice, fallback } = pickVoice(lang);
  const u = new SpeechSynthesisUtterance(text);
  if (voice){ u.voice = voice; u.lang = voice.lang; } else { u.lang = lang; }
  u.rate = parseFloat($('#rate').value);
  if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
  const names = {'en-GB':'British','en-US':'American','en-AU':'Australian'};
  $('#voiceNote').textContent = (fallback && voice) ? `No ${names[lang]} voice on this device — using ${voice.name} instead.` : '';
  speechSynthesis.speak(u);
}

/* ---------- Generic MCQ (answers shuffled on every load) ---------- */
// item: {q, options:[...], answer:index, why, say?}  opts: {fixed:true} keeps option order
function renderMCQ(rootSel, prefix, items, opts = {}){
  const root = $(rootSel);
  root.innerHTML = items.map((it, i) => {
    const key = `${prefix}-${i}`; register(key);
    const order = opts.fixed ? it.options.map((_, j) => j) : shuffle(it.options.map((_, j) => j));
    return `<div class="question" data-key="${key}">
      <p><b>${i + 1}.</b> ${esc(it.q)}</p>
      <div class="choices">${order.map(j => `<button type="button" data-opt="${j}">${esc(it.options[j])}</button>`).join('')}</div>
      <div class="qtools">${it.say ? `<button type="button" class="say" data-speak="${esc(it.say)}">🔊 Listen</button>` : ''}<button type="button" class="hintbtn" data-qhint>💡 Hint</button></div>
      <div class="feedback" aria-live="polite"></div></div>`;
  }).join('');
  root.querySelectorAll('.question').forEach((card, i) => {
    const it = items[i], fb = card.querySelector('.feedback'), key = card.dataset.key;
    card.querySelectorAll('[data-opt]').forEach(btn => btn.addEventListener('click', () => {
      const ok = +btn.dataset.opt === it.answer;
      card.querySelectorAll('[data-opt]').forEach(b => b.classList.remove('right', 'wrong'));
      btn.classList.add(ok ? 'right' : 'wrong');
      card.classList.toggle('done', ok);
      fb.innerHTML = ok ? `<span class="correct">✓ Correct!</span> ${esc(it.why)}`
                        : `<span class="incorrect">✗ Not quite — try again.</span> <span class="neutral">Look for the signal word, or use 💡 Hint.</span>`;
      mark(key, ok);
    }));
    card.querySelector('[data-qhint]').addEventListener('click', () => {
      fb.innerHTML = `<span class="neutral">💡 ${esc(it.hint || 'Focus on the tense, form and time expression before selecting. Check the explanation after you answer.')}</span>`;
    });
  });
}

/* ---------- Typed drill: auto-confirms when right; Check button explains when wrong ---------- */
const norm = s => String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[.!?,]+$/g, '').replace(/\s+/g, ' ').trim();
// item: [prompt, [accepted answers], why]
function renderDrill(rootSel, prefix, items, placeholder = 'Type your answer'){
  const root = $(rootSel);
  root.innerHTML = items.map((q, i) => {
    const key = `${prefix}-${i}`; register(key);
    return `<div class="drill" data-key="${key}">
      <label for="${key}">${i + 1}. ${esc(q[0])}</label>
      <input id="${key}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(placeholder)}">
      <div class="row"><button type="button" data-act="check">Check</button><button type="button" class="hintbtn" data-act="hint">💡 Hint</button><button type="button" class="model" data-act="show">👁 Answer</button></div>
      <div class="feedback" aria-live="polite"></div></div>`;
  }).join('');
  root.querySelectorAll('.drill').forEach((card, i) => {
    const [, answers, why] = items[i], inp = card.querySelector('input'), fb = card.querySelector('.feedback'), key = card.dataset.key;
    const isRight = () => answers.some(a => norm(a) === norm(inp.value));
    const verdict = (explain) => {
      const v = norm(inp.value);
      if (!v){ fb.innerHTML = '<span class="neutral">Write your answer first.</span>'; return; }
      if (isRight()){ fb.innerHTML = `<span class="correct">✓ Correct!</span> ${esc(why)}`; card.classList.add('done'); mark(key, true); }
      else if (explain){ fb.innerHTML = `<span class="incorrect">✗ Not yet.</span> Check the tense and verb form. Try again or use 💡 Hint.`; card.classList.remove('done'); mark(key, false); }
    };
    inp.addEventListener('input', () => { if (isRight()) verdict(false); else { if (card.classList.contains('done')){ card.classList.remove('done'); mark(key, false); } fb.innerHTML = inp.value.trim() ? '<span class="neutral">Keep going — not confirmed yet. Use Check for feedback.</span>' : ''; } });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') verdict(true); });
    card.querySelector('[data-act="check"]').addEventListener('click', () => verdict(true));
    let hintStep = 0;
    card.querySelector('[data-act="hint"]').addEventListener('click', () => {
      hintStep = Math.min(hintStep + 1, 3);
      const prompt = items[i][0];
      const verb = (prompt.match(/\(([^)]+)\)/) || [])[1];
      const signals = ['yesterday','last ','ago','since','for ','ever','never','already','yet','usually','every','often','twice'];
      const signal = signals.find(k => prompt.toLowerCase().includes(k));
      const hints = [
        verb ? `Verb clue: ${verb}. Identify the subject and whether the sentence describes a habit, a completed event or an experience.` : `Read the question carefully. Identify the subject, auxiliary and time expression.`,
        signal ? `Time/structure clue: “${signal.trim()}”. ${signal.startsWith('last') || signal==='yesterday' || signal==='ago' ? 'Think about a finished moment.' : signal==='since' || signal==='ever' || signal==='already' || signal==='yet' || signal==='never' ? 'Think about a link to the present.' : 'Think about the function of the sentence.'}` : 'Make the affirmative, negative or question structure first. Check the auxiliary.',
        why
      ];
      fb.innerHTML = `<span class="neutral">💡 Hint ${hintStep}/3: ${esc(hints[hintStep-1])}</span>`;
    });
    card.querySelector('[data-act="show"]').addEventListener('click', () => { fb.innerHTML = `<span class="neutral">👁 ${esc(answers[0])} — ${esc(why)}</span>`; });
  });
}

/* ================= CONTENT ================= */

/* Stations: name, distance, muscles, action, sentence, emoji */
const stations = [
  ['SkiErg','1,000 m','shoulders, lats, triceps, core','Pull both handles down in a powerful, rhythmic movement.','I used my upper body and core to keep a steady rhythm.'],
  ['Sled push','50 m','quadriceps, glutes, calves, core','Drive a heavy sled forward, body low, arms locked.','I pushed through my legs and kept my body low.'],
  ['Sled pull','50 m','back, biceps, grip, glutes','Pull a heavy sled towards you with a rope, hand over hand.','My grip and back muscles worked hard during the pull.'],
  ['Burpee broad jumps','80 m','chest, shoulders, quads, glutes, core','Drop to the floor, get up and jump forward as far as you can.','I had to control my breathing between the jumps.'],
  ['Rowing','1,000 m','legs, back, arms, core','Push with the legs first, then lean back and pull.','I focused on technique rather than rushing.'],
  ["Farmers carry",'200 m','forearms, traps, shoulders, core','Walk fast while carrying two heavy kettlebells.','My grip strength was tested throughout the carry.'],
  ['Sandbag lunges','100 m','quadriceps, glutes, hamstrings, core','Lunge forward with a sandbag on your shoulders; the back knee touches the floor.','I kept my balance even when my legs were burning.'],
  ['Wall balls','100 reps*','quadriceps, glutes, shoulders, core','Squat deep and throw a medicine ball at a high target.','I had to stay focused right up to the finish line.']
];
const L = '#e4ff3a', E = '#7f8c98';
const fig = d => `<path d="${d}" fill="none" stroke="${L}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
const head = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${L}"/>`;
const stationArt = [
  // SkiErg
  `<rect x="168" y="12" width="18" height="106" rx="4" fill="${E}"/><path d="M174 22L142 64M180 22L148 66" stroke="#c9d3db" stroke-width="2"/>${head(116,36)}${fig('M116 46L110 80M114 54L144 64M110 80L100 116M110 80L124 116')}`,
  // Sled push
  `<rect x="150" y="84" width="62" height="26" rx="3" fill="${E}"/><rect x="154" y="48" width="7" height="38" fill="${E}"/><rect x="200" y="48" width="7" height="38" fill="${E}"/>${head(118,56)}${fig('M108 64L72 88M106 66L152 56M72 88L52 116M72 88L90 100L96 116')}<path d="M22 70h22M14 84h26M22 98h18" stroke="${L}" stroke-width="2" opacity=".5"/>`,
  // Sled pull
  `<rect x="18" y="88" width="58" height="22" rx="3" fill="${E}"/><path d="M76 98L148 72" stroke="#c9d3db" stroke-width="3"/>${head(156,48)}${fig('M158 58L168 92M158 66L146 74M168 92L150 116M168 92L188 116')}`,
  // Burpee broad jump
  `${head(34,104)}${fig('M44 108L92 112M48 108L48 117')}<path d="M98 108Q142 10 196 108" fill="none" stroke="${L}" stroke-width="2" stroke-dasharray="5 6" opacity=".7"/>${head(150,38)}${fig('M150 48L146 72M149 54L132 40M149 54L168 40M146 72L134 90M146 72L162 88')}`,
  // Rowing
  `<path d="M36 110H214" stroke="${E}" stroke-width="7" stroke-linecap="round"/><circle cx="200" cy="92" r="17" fill="${E}"/><rect x="96" y="96" width="24" height="8" rx="2" fill="${E}"/><path d="M150 78L188 90" stroke="#c9d3db" stroke-width="2"/>${head(92,52)}${fig('M96 62L106 94M98 68L150 78M106 94L140 78L168 104')}`,
  // Farmers carry
  `${head(120,30)}${fig('M120 40L120 80M120 46L104 84M120 46L136 84M120 80L106 116M120 80L134 116')}<circle cx="104" cy="96" r="11" fill="${E}"/><circle cx="136" cy="96" r="11" fill="${E}"/><path d="M98 86h12M130 86h12" stroke="${E}" stroke-width="4"/><path d="M40 60h30M30 76h36M40 92h26" stroke="${L}" stroke-width="2" opacity=".5"/>`,
  // Sandbag lunges
  `<rect x="94" y="40" width="52" height="16" rx="8" fill="${E}"/>${head(120,30)}${fig('M120 54L120 82M120 82L148 92L148 116M120 82L100 106L86 114M116 56L104 48M124 56L136 48')}`,
  // Wall balls
  `<rect x="200" y="6" width="14" height="112" fill="${E}"/><circle cx="200" cy="28" r="10" fill="none" stroke="${L}" stroke-width="3"/>${head(132,56)}${fig('M134 66L122 90M122 90L148 94L146 116M122 90L120 116M132 70L152 54')}<circle cx="160" cy="46" r="9" fill="${E}"/><path d="M168 40Q186 10 196 26" fill="none" stroke="${L}" stroke-width="2" stroke-dasharray="4 5"/>`
];
const svg = i => `<svg viewBox="0 0 240 130" role="img" aria-label="Illustration: ${esc(stations[i][0])}"><path d="M0 119H240" stroke="#41505d" stroke-width="2"/><text x="10" y="18" font-size="11" font-family="Inter,Arial" font-weight="700" fill="#9fb0bd" letter-spacing="1.5">STATION ${i + 1}</text>${stationArt[i]}</svg>`;

/* Vocabulary: [word, French, example] */
const vocab = {
  race: { label:'🏁 Race & atmosphere', words:[
    ['heat','vague / série de départ','Our heat started at 2:15 in the afternoon.'],
    ['crowd','foule / public','The crowd cheered us on in the final run.'],
    ['pace','allure / rythme','I tried to keep a steady pace on every run.'],
    ['split time','temps intermédiaire','My split time on the sled push was slow.'],
    ['finish line','ligne d’arrivée','Crossing the finish line felt incredible.'],
    ['personal best (PB)','record personnel','I hope to set a new personal best next time.']]},
  logistics: { label:'🎟 Race-day logistics', words:[
    ['check in','s’enregistrer / retirer son dossard','We checked in with our ID on race day.'],
    ['bib number','numéro de dossard','My bib number was on my chest.'],
    ['timing chip','puce de chronométrage','The timing chip recorded all my split times.'],
    ['wristband','bracelet d’accès','You can’t enter the athlete area without a wristband.'],
    ['Roxzone','zone de transition HYROX','Don’t walk in the Roxzone — it counts in your time!'],
    ['finisher patch','écusson de finisher','Every athlete got a finisher patch at the end.']]},
  training: { label:'🏋️ Training routines', words:[
    ['work out','s’entraîner','I work out five times a week.'],
    ['warm up','s’échauffer','I always warm up for ten minutes.'],
    ['build endurance','développer l’endurance','Long runs help me build endurance.'],
    ['pace yourself','gérer son effort','You need to pace yourself in the first kilometre.'],
    ['recover','récupérer','I need a full day to recover after a race.'],
    ['rest day','jour de repos','Sunday is usually my rest day.']]},
  body: { label:'💪 Muscles & movement', words:[
    ['quadriceps / quads','quadriceps','Lunges work the quads very hard.'],
    ['hamstrings','ischio-jambiers','My hamstrings were tight after the race.'],
    ['glutes','fessiers','The sled push activates your glutes.'],
    ['core','sangle abdominale / gainage','A strong core helps with balance.'],
    ['grip strength','force de préhension','The farmers carry tests your grip strength.'],
    ['sore','courbaturé','My legs were sore for two days.']]},
  travel: { label:'🚗 Travel & accommodation', words:[
    ['accommodation','hébergement (indénombrable)','We booked accommodation in Thonon-les-Bains.'],
    ['host','hôte (Airbnb)','Our host gave us great tips about the area.'],
    ['cross the border','passer la frontière','We crossed the border into Switzerland.'],
    ['venue','lieu de l’événement','The venue is right next to Geneva Airport.'],
    ['journey','trajet','The journey took about forty-five minutes.'],
    ['traffic','circulation','There was a lot of traffic near Geneva.']]},
  reflection: { label:'🧠 Feelings & progress', words:[
    ['exhausted','épuisé','I was exhausted but happy at the finish.'],
    ['proud of','fier de','I felt proud of what we achieved.'],
    ['push my limits','repousser mes limites','The wall balls really pushed my limits.'],
    ['overcome (overcame, overcome)','surmonter','I overcame a difficult moment on the sled.'],
    ['so far','jusqu’à présent','I have done two races so far.'],
    ['worthwhile','qui en vaut la peine','All the training was worthwhile.']]}
};
const vocabQuiz = [
  {q:'The number on your chest during the race is your ___.', options:['bib number','timing chip','wristband'], answer:0, why:'Bib number = dossard.'},
  {q:'The transition area between the track and the stations is the ___.', options:['Thunderdome','Roxzone','finish line'], answer:1, why:'The Roxzone counts in your total time.'},
  {q:'“Gérer son effort” in English is…', options:['push my limits','work out','pace yourself'], answer:2, why:'Pace yourself = don’t start too fast.'},
  {q:'We booked ___ in Thonon-les-Bains.', options:['an accommodation','accommodation','accommodations place'], answer:1, why:'Accommodation is uncountable in British English: no “an”.'},
  {q:'My legs were ___ for two days after the race.', options:['sore','sour','soar'], answer:0, why:'Sore = courbaturé, douloureux.'},
  {q:'The time recorded for one part of the race is a ___.', options:['heat','personal best','split time'], answer:2, why:'Split time = temps intermédiaire.'}
];

/* Drills: [prompt, [accepted], why] */
const D = {
  booking:[
    ['Write the date in words (British): Saturday 10 October.',['saturday the tenth of october','saturday tenth of october'],'British: weekday + THE + ordinal + OF + month.'],
    ['Write 2026 in words.',['twenty twenty-six','twenty twenty six','two thousand and twenty-six','two thousand twenty-six'],'Most people say “twenty twenty-six”.'],
    ['What is the ordinal of 11?',['eleventh'],'11th = eleventh.'],
    ['We ___ (book) our Airbnb in September.',['booked'],'Finished action → past simple, regular -ed.'],
    ['___ you bring your ID to check-in?',['did'],'Past question: Did + subject + base verb.'],
    ['Our race ___ (be) on Saturday.',['was'],'Singular subject → was.']
  ],
  warm:[
    ['Last weekend, we ___ (stay) in Thonon-les-Bains.',['stayed'],'Regular verb: stay → stayed.'],
    ['We ___ (drive) across the border to Geneva.',['drove'],'Irregular: drive → drove.'],
    ['Our heat ___ (start) in the afternoon.',['started'],'start → started (pronounced /ɪd/).'],
    ['I ___ (feel) nervous before the start.',['felt'],'Irregular: feel → felt.'],
    ['___ you enjoy the competition?',['did'],'Past question: Did you enjoy…?'],
    ['The atmosphere ___ (be) electric.',['was'],'The atmosphere = it → was.']
  ],
  habit:[
    ['I ___ (run) three times a week.',['run'],'I + base verb.'],
    ['My training partner ___ (train) at the same gym.',['trains'],'He/she → + -s.'],
    ['He ___ (not / skip) his warm-up.',['does not skip',"doesn't skip"],'does not / doesn’t + base verb (no -s).'],
    ['___ you lift weights every week?',['do'],'Do + you + base verb.'],
    ['She ___ (go) to the gym on Mondays.',['goes'],'go → goes (-es after -o).'],
    ['My coach ___ (watch) our technique closely.',['watches'],'watch → watches (-es after -ch).'],
    ['My friend ___ (study) sports nutrition.',['studies'],'Consonant + y → -ies.'],
    ['We ___ (not / train) on Sundays.',['do not train',"don't train"],'do not / don’t + base verb.'],
    ['How often ___ he run?',['does'],'Does + he + base verb.'],
    ['She ___ (have) a detailed training plan.',['has'],'have → has with he/she/it.']
  ],
  past:[
    ['I ___ (take) a short break after the sled pull.',['took'],'take → took.'],
    ['We ___ (not / stop) during the final run.',['did not stop',"didn't stop"],'did not / didn’t + base verb.'],
    ['Where ___ you stay?',['did'],'Where did + subject + base verb?'],
    ['I ___ (carry) two heavy kettlebells.',['carried'],'Consonant + y → -ied.'],
    ['We ___ (plan) our journey carefully.',['planned'],'Short verb ending consonant-vowel-consonant: double the n.'],
    ['We ___ (not / be) late.',['were not',"weren't"],'we → were not / weren’t.'],
    ['She ___ (push) the sled to the line.',['pushed'],'Regular: push → pushed.'],
    ['They ___ (run) eight kilometres.',['ran'],'run → ran.'],
    ['I ___ (lose) a lot of time on the burpees.',['lost'],'lose → lost.'],
    ['After the race, we ___ (go) out for dinner.',['went'],'go → went.']
  ],
  perfect:[
    ['I ___ (never / try) that station before.',['have never tried',"'ve never tried"],'have + never + past participle.'],
    ['We ___ (already / book) our next race.',['have already booked',"'ve already booked"],'have + already + past participle.'],
    ['___ you ever competed abroad?',['have'],'Have + you + ever + past participle?'],
    ['She ___ (improve) her stamina recently.',['has improved',"'s improved"],'She → has + past participle.'],
    ['We ___ (not / receive) the photos yet.',['have not received',"haven't received"],'have not / haven’t + participle + yet.'],
    ['He ___ (do) HYROX twice.',['has done',"'s done"],'do → did → done.'],
    ['I ___ (be) to Switzerland many times.',['have been',"'ve been"],'been to = visited and came back.'],
    ['___ your training changed since the race?',['has'],'Has + singular subject + past participle?'],
    ['I ___ (not / see) my official photos yet.',['have not seen',"haven't seen"],'see → saw → seen.'],
    ['We ___ (learn) a lot from the experience.',['have learned','have learnt',"'ve learned","'ve learnt"],'learn → learned/learnt.']
  ],
  mixed:[
    ['I usually ___ (run) before work.',['run'],'usually → habit → present simple.'],
    ['Last Sunday I ___ (run) in Geneva.',['ran'],'last Sunday → finished time → past simple.'],
    ['I ___ (never / run) such a hard race before.',['have never run',"'ve never run"],'never … before → experience until now → present perfect.'],
    ['He ___ (lift) weights every Tuesday.',['lifts'],'every Tuesday → habit; he → -s.'],
    ['___ you train yesterday?',['did'],'yesterday → past simple question.'],
    ['___ you ever trained abroad?',['have'],'ever → present perfect.'],
    ['My endurance ___ (improve) since January.',['has improved',"'s improved"],'since + starting point → present perfect.'],
    ['We ___ (not / finish) before noon last Sunday.',['did not finish',"didn't finish"],'last Sunday → past simple negative.']
  ],
  spot:[
    ['✗ I have competed in Geneva last weekend.',['i competed in geneva last weekend'],'“last weekend” is a finished time → past simple.'],
    ['✗ Did you finished the race?',['did you finish the race'],'After did → base verb: finish.'],
    ['✗ I train for HYROX since January.',['i have trained for hyrox since january','i have been training for hyrox since january',"i've trained for hyrox since january","i've been training for hyrox since january"],'since + starting point → present perfect (simple or continuous).'],
    ['✗ My partner run every morning.',['my partner runs every morning'],'Third person singular → runs.'],
    ['✗ We have went to Switzerland twice.',['we have been to switzerland twice',"we've been to switzerland twice"],'Past participle of go for a visit → been.'],
    ['✗ Have you ever do a sled pull?',['have you ever done a sled pull'],'have + past participle: done.']
  ]
};

const MCQ = {
  habit:[
    {q:'Which sentence is correct?', options:['I usually warm up for ten minutes.','I warm up usually for ten minutes.','Usually I warm up usually.'], answer:0, why:'Frequency adverb before the main verb.'},
    {q:'Which sentence is correct?', options:['I usually am tired after leg day.','I am usually tired after leg day.','Usually tired I am after leg day.'], answer:1, why:'With be, the adverb goes after: I am usually…'},
    {q:'Which sentence is correct?', options:['Does your partner trains with you?','Do your partner train with you?','Does your partner train with you?'], answer:2, why:'Does + subject + base verb (no -s).'},
    {q:'Which sentence is correct?', options:['We never skip rest days.','We skip never rest days.','We don’t never skip rest days.'], answer:0, why:'never goes before the verb — and no double negative.'}
  ],
  past:[
    {q:'Last weekend, we ___ in an Airbnb.', options:['stayed','have stayed','stay'], answer:0, why:'Last weekend = finished time → past simple.'},
    {q:'We ___ to the venue early on Sunday.', options:['have driven','drove','driven'], answer:1, why:'drive → drove → driven. Past simple = drove.'},
    {q:'___ you feel nervous before the start?', options:['Were','Have','Did'], answer:2, why:'Did + subject + base verb (feel).'},
    {q:'I ___ stop during the first run.', options:['haven’t','didn’t','wasn’t'], answer:1, why:'Past simple negative: didn’t + base verb.'},
    {q:'The atmosphere ___ amazing.', options:['were','did','was'], answer:2, why:'The atmosphere = it → was.'},
    {q:'We ___ ready when the race began.', options:['were','was','have been'], answer:0, why:'we → were.'},
    {q:'I ___ my pace after the sled push.', options:['adjust','adjusted','have adjusted'], answer:1, why:'A completed race action → adjusted.'},
    {q:'Where ___ you stay?', options:['have','were','did'], answer:2, why:'Where did + subject + base verb?'},
    {q:'We didn’t ___ the same strategy all race.', options:['use','used','using'], answer:0, why:'After didn’t → base verb.'},
    {q:'I ___ exhausted at the finish.', options:['feel','have felt','felt'], answer:2, why:'feel → felt.'}
  ],
  perfect:[
    {q:'I ___ never tried this station before.', options:['did','have','was'], answer:1, why:'have + never + past participle.'},
    {q:'___ you ever competed abroad?', options:['Did','Were','Have'], answer:2, why:'Have you ever + past participle?'},
    {q:'We haven’t entered another race ___.', options:['yet','already','yesterday'], answer:0, why:'yet = end of negatives and questions.'},
    {q:'I have trained regularly ___ January.', options:['for','since','ago'], answer:1, why:'since + starting point.'},
    {q:'I have been running ___ six months.', options:['since','last','for'], answer:2, why:'for + duration.'},
    {q:'I have just ___ my recovery session.', options:['finished','finish','finishing'], answer:0, why:'have + past participle.'},
    {q:'I have ___ to Geneva before.', options:['went','been','go'], answer:1, why:'been to = visited and came back.'},
    {q:'He ___ improved his technique.', options:['have','did','has'], answer:2, why:'he/she/it → has.'},
    {q:'My partner has ___ to the gym — she’s not home.', options:['gone','been','went'], answer:0, why:'gone = she went and is still there.'},
    {q:'I ___ been training for months.', options:['did','have','am'], answer:1, why:'Present perfect continuous: have been + -ing.'}
  ],
  mixed:[
    {q:'I ___ in Geneva last weekend.', options:['have competed','competed'], answer:1, why:'Finished time → past simple.'},
    {q:'I ___ in three fitness races so far.', options:['have taken part','took part'], answer:0, why:'so far links experience to now → present perfect.'},
    {q:'We ___ in Thonon-les-Bains during the event.', options:['have stayed','stayed'], answer:1, why:'A completed trip → past simple.'},
    {q:'I ___ more confident since I started training.', options:['have become','became'], answer:0, why:'since → present perfect.'},
    {q:'I ___ the sled pull very hard on Saturday.', options:['found','have found'], answer:0, why:'on Saturday = finished time.'},
    {q:'___ you ever tried a doubles race?', options:['Did','Have'], answer:1, why:'ever = life experience → present perfect.'},
    {q:'I ___ before work most mornings.', options:['run','have run','ran'], answer:0, why:'most mornings = habit → present simple.'},
    {q:'My training ___ a lot over the past year.', options:['changed','has changed'], answer:1, why:'over the past year (until now) → present perfect.'}
  ]
};

/* -ed pronunciation: 0=/t/ 1=/d/ 2=/ɪd/ */
const edWords = [['booked',0],['stayed',1],['competed',2],['pushed',0],['travelled',1],['started',2],['jumped',0],['pulled',1],['needed',2],['finished',0],['planned',1],['rested',2]];
const edWhy = ['/t/ — after a voiceless sound (k, p, s, sh, ch, f).','/d/ — after a vowel or a voiced sound.','/ɪd/ — the verb ends in t or d, so we add a syllable.'];

/* Listening */
const listenScript = [
  ['Commentator','Good afternoon from Palexpo in Geneva! It’s Saturday the tenth of October, and the Thunderdome is absolutely packed.'],
  ['Commentator','The two-fifteen heat has just finished, and I’m here with Sam, who has travelled all the way from Melbourne. Sam, how was it?'],
  ['Sam','Honestly? Brutal, but brilliant! I flew in on Wednesday, so I had a few days to recover from the jet lag.'],
  ['Commentator','Which station hurt the most?'],
  ['Sam','The sled push, definitely. The carpet felt really slow today, and my legs were burning. I lost about thirty seconds there.'],
  ['Commentator','And how did the wall balls go?'],
  ['Sam','Better than I expected. I broke them into sets of ten and didn’t stop for too long.'],
  ['Commentator','Is this your first HYROX?'],
  ['Sam','No — Geneva was my fifth race, but my first one in Europe. I’ve already started planning the next one: Melbourne, at home, in December.']
];
const listenQuiz = [
  {q:'What day is the race?', options:['Saturday 10 October','Sunday 11 October','Friday 9 October'], answer:0, why:'“It’s Saturday the tenth of October.”'},
  {q:'Where does Sam come from?', options:['Sydney','Melbourne','Geneva'], answer:1, why:'He has travelled all the way from Melbourne.'},
  {q:'When did Sam arrive in Switzerland?', options:['On Friday','On race day','On Wednesday'], answer:2, why:'“I flew in on Wednesday.”'},
  {q:'Which station was the hardest for Sam?', options:['The sled push','The wall balls','The rowing'], answer:0, why:'The sled push — he lost about thirty seconds there.'},
  {q:'How did he do the wall balls?', options:['All 100 without stopping','In sets of ten','He skipped them'], answer:1, why:'He broke them into sets of ten.'},
  {q:'How many HYROX races has Sam done now?', options:['One','Four','Five'], answer:2, why:'Geneva was his fifth race.'},
  {q:'Which sentence from the interview is in the present perfect?', options:['I flew in on Wednesday.','I’ve already started planning the next one.','I broke them into sets of ten.'], answer:1, why:'’ve already started = have + already + past participle: a result that matters now.'}
];

/* Story order (correct order) */
const storyCorrect = [
  'We showed our ID, checked in and collected our timing chips.',
  'We warmed up near the Roxzone while the previous heat was finishing.',
  'Our heat started, and we ran the first kilometre.',
  'The sled push was demanding, so we adjusted our strategy.',
  'We reached the wall balls near the end of the course.',
  'After the final station, we crossed the finish line.'
];

/* Replay: habit / race / learned per station */
const replay = [
  ['I usually do short SkiErg intervals twice a week.','In Geneva, I started the SkiErg too fast and my arms burned early.','I have learned to start at a pace I can hold.'],
  ['I normally push a sled once a week at my gym.','In Geneva, the sled felt much heavier than in training.','I have realised that leg strength makes a huge difference.'],
  ['I rarely practise the sled pull, to be honest.','During the race, I took small, quick steps backwards and kept pulling.','I have added more grip work to my programme since then.'],
  ['I do burpees in most of my conditioning sessions.','In Geneva, I found a steady rhythm and didn’t stop.','I have discovered that breathing is the key.'],
  ['I row for twenty minutes every Wednesday.','During the race, I used the rowing to recover a little.','I have learned to use some stations to control my heart rate.'],
  ['I usually carry heavy kettlebells at the end of my sessions.','In Geneva, I walked fast and didn’t put the kettlebells down.','My grip has improved a lot over the past few months.'],
  ['I train lunges every leg day.','During the race, my legs were burning, but I kept going.','I have understood why everyone says the lunges are brutal!'],
  ['I often finish my workouts with wall balls.','In Geneva, I broke the reps into small sets.','I have never felt so happy to see a finish line!']
];

/* Speaking prompts: title, question, B1, B2 */
const oral = [
  ['Describe your training routine','How often do you train? What does a typical week look like? (present simple)','I train five times a week. I usually run on Monday and Thursday, and I lift weights three times a week. I always take one rest day.','My week usually combines running, strength work and HYROX-specific sessions. I tend to run twice a week, lift three times and keep Sundays for recovery, because I don’t want to get injured.'],
  ['Tell the Geneva race story','Where did you stay? What happened before, during and after the race? (past simple)','We stayed in Thonon-les-Bains and drove to Geneva on race day. We checked in, warmed up and started in the afternoon. The sled push was very hard, but we finished together.','We based ourselves in Thonon-les-Bains and drove across the border on race day. After checking in, we warmed up near the Roxzone. We set off a little too fast, and the sled push punished us for it, but we adapted and crossed the line together.'],
  ['Describe your race photo','Open one of your Sportograf photos. Where are you? What are you doing? How were you feeling?','In this photo, I am on the sled push. You can see the crowd behind me. I was very tired, but I was also very motivated.','This shot was taken during the sled push — you can tell from my face how heavy it was! In the background, the crowd is cheering. At that moment I was struggling, but I was determined not to stop.'],
  ['Reflect on the experience','What have you learned? How has your training changed? (present perfect)','I have learned to start more slowly. Since the race, I have trained more on the sled, and I have become more confident.','The race has taught me that pacing matters more than raw strength. Since Geneva, I’ve changed my training: I’ve added more sled work and I’ve practised transitions, so I feel much better prepared.']
];

/* Writing tasks */
const writing = [
  ['✉️ A message to a friend','Write 70–100 words to a friend: where you stayed, what happened at the race, and how you felt.',70,100,'Hi Max! We stayed in an Airbnb in Thonon-les-Bains and drove to Geneva for HYROX. The race was really intense, especially the sled push, but the atmosphere was amazing. We finished together and I felt very proud. I have already started thinking about the next race. You should come and watch next time!','Hi Max! What a weekend! We based ourselves in Thonon-les-Bains and crossed the border to Palexpo on Saturday. The sled push was brutal and the wall balls nearly finished me off, but the crowd kept us going. Crossing the line together was unforgettable. Since then, I’ve been looking at the calendar — I’ve heard there’s a race in Melbourne in December!'],
  ['💼 A professional reflection','Write 90–130 words: what did the race teach you about preparation, resilience and teamwork? Connect it to work.',90,130,'Last weekend, I took part in a HYROX race in Geneva. I prepared for months, but the race was still very hard. During the event, I had to manage my energy and stay calm. My partner and I supported each other. This experience has taught me that preparation and teamwork are very important, at work too. I have become more confident in difficult situations.','Competing in HYROX Geneva was a valuable lesson in discipline and problem-solving. Although I had trained consistently, the race still demanded quick decisions about pacing and energy. When the sled push slowed us down, my partner and I adapted our strategy instead of panicking. The experience has reinforced something I applied as a process analyst: you plan carefully, measure as you go and adjust under pressure. I’ve become more aware of how resilience transfers to professional challenges.']
];

/* ================= RENDER ================= */

/* Navigation from sections */
const navSections = $$('section[data-nav]');
$('#nav').innerHTML = navSections.map((s, i) => `<a href="#${s.id}">${String(i).padStart(2,'0')} · ${s.dataset.nav}</a>`).join('') + `<a href="#evaluation">★ · Feedback</a>`;
if ('IntersectionObserver' in window){
  const links = $$('#nav a');
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting){ links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }
  }), { rootMargin:'-30% 0px -60% 0px' });
  navSections.forEach(s => io.observe(s));
}

/* Stations */
$('#stations').innerHTML = stations.map((s, i) => `<article class="station">
  <button type="button" aria-expanded="false" data-station="${i}"><span class="stnum">${i + 1}</span><span class="stname">${esc(s[0])}</span><span class="stdist">${esc(s[1])}</span><span class="chev">⌄</span></button>
  <div class="detail hidden">${svg(i)}<p><b>Action:</b> ${esc(s[3])}</p><p><b>Muscles:</b> ${esc(s[2])}</p><p><b>Say it:</b> <i>${esc(s[4])}</i></p>
  <button type="button" class="say small" data-speak="${esc(s[4])}">🔊 Listen</button></div></article>`).join('');
$$('[data-station]').forEach(b => b.addEventListener('click', () => {
  const d = b.nextElementSibling; d.classList.toggle('hidden'); b.setAttribute('aria-expanded', !d.classList.contains('hidden'));
}));

/* Vocabulary */
const catKeys = Object.keys(vocab);
$('#catButtons').innerHTML = catKeys.map((k, i) => `<button type="button" role="tab" data-cat="${k}" aria-selected="${i === 0}">${vocab[k].label}</button>`).join('');
function renderVocab(k){
  $$('#catButtons button').forEach(b => b.setAttribute('aria-selected', b.dataset.cat === k));
  $('#vocab').innerHTML = vocab[k].words.map(w => `<div class="vcard"><div class="vh"><b>${esc(w[0])}</b><button type="button" class="say" data-speak="${esc(w[0].replace(/\s*\(.*\)/,''))}" aria-label="Listen to ${esc(w[0])}">🔊</button></div>
    <div class="vfr">🇫🇷 ${esc(w[1])}</div><p class="vex">${esc(w[2])}</p><button type="button" class="say" data-speak="${esc(w[2])}">🔊 Example</button></div>`).join('');
}
$('#catButtons').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) renderVocab(b.dataset.cat); });
renderVocab(catKeys[0]);

/* Quizzes and drills */
renderMCQ('#vocabQuiz', 'voc', vocabQuiz);
renderDrill('#bookingQuiz', 'book', D.booking);
renderDrill('#warmQuiz', 'warm', D.warm);
renderDrill('#habitQuiz', 'hab', D.habit);
renderMCQ('#habitMCQ', 'habm', MCQ.habit);
renderMCQ('#pastQ', 'pastm', MCQ.past);
renderDrill('#pastExtra', 'past', D.past);
renderMCQ('#edQuiz', 'ed', edWords.map(([w, a]) => ({q:w, options:['/t/','/d/','/ɪd/'], answer:a, why:edWhy[a], say:w})), {fixed:true});
renderMCQ('#perfectQ', 'perfm', MCQ.perfect);
renderDrill('#perfectExtra', 'perf', D.perfect);
renderMCQ('#mixedQ', 'mixm', MCQ.mixed);
renderDrill('#mixedExtra', 'mix', D.mixed);
renderDrill('#spotQuiz', 'spot', D.spot, 'Rewrite the correct sentence');
renderMCQ('#listenQuiz', 'lis', listenQuiz);

/* Listening */
$('#transcript').innerHTML = listenScript.map(([who, line]) => `<p><b>${who}:</b> ${esc(line)}</p>`).join('');
let listening = false;
$('#playListen').addEventListener('click', () => {
  let i = 0; listening = true;
  $('#playListen').textContent = '▶ Playing…';
  const next = () => {
    if (!listening || i >= listenScript.length){ listening = false; $('#playListen').textContent = '▶ Play again'; return; }
    speak(listenScript[i++][1], () => setTimeout(next, 350));
  };
  next();
});
$('#stopListen').addEventListener('click', () => { listening = false; if ('speechSynthesis' in window) speechSynthesis.cancel(); $('#playListen').textContent = '▶ Play the commentary'; });

/* Story order */
register('story');
let storyPicked = [];
function renderStory(){
  const pool = $('#storyPool');
  if (!pool.dataset.order){ let o; do { o = shuffle(storyCorrect.map((_, i) => i)); } while (o.every((v, i) => v === i)); pool.dataset.order = o.join(','); }
  const order = pool.dataset.order.split(',').map(Number);
  pool.innerHTML = order.filter(i => !storyPicked.includes(i)).map(i => `<button type="button" data-story="${i}">${esc(storyCorrect[i])}</button>`).join('') || '<p class="muted">All sentences placed — check your order!</p>';
  $('#storyAnswer').innerHTML = storyPicked.map(i => `<li>${esc(storyCorrect[i])}</li>`).join('');
}
$('#storyPool').addEventListener('click', e => { const b = e.target.closest('[data-story]'); if (!b) return; storyPicked.push(+b.dataset.story); $('#storyFeedback').textContent = ''; renderStory(); });
$('#storyUndo').addEventListener('click', () => { storyPicked.pop(); renderStory(); });
$('#storyClear').addEventListener('click', () => { storyPicked = []; $('#storyFeedback').textContent = ''; mark('story', false); renderStory(); });
$('#storyCheck').addEventListener('click', () => {
  const fb = $('#storyFeedback');
  if (storyPicked.length < storyCorrect.length){ fb.innerHTML = '<span class="neutral">Place all six sentences first.</span>'; return; }
  const lis = $$('#storyAnswer li'); let right = 0;
  storyPicked.forEach((v, i) => { const ok = v === i; lis[i].classList.add(ok ? 'ok' : 'no'); if (ok) right++; });
  const ok = right === storyCorrect.length;
  fb.innerHTML = ok ? '<span class="correct">✓ Perfect order! Now read the story aloud with natural rhythm.</span> <button type="button" class="say small" id="storySay">🔊 Listen</button>'
                    : `<span class="incorrect">✗ ${right}/6 in the right place.</span> 💡 Follow the real course chronology: registration → warm-up → start → sled push → wall balls → finish.`;
  mark('story', ok);
  const s = $('#storySay'); if (s) s.addEventListener('click', () => speak(storyCorrect.join(' ')));
});
renderStory();

/* Race replay with 45-second timers */
$('#raceReplayCards').innerHTML = stations.map((st, i) => `<article>
  <strong>RUN ${i + 1} · 1 KM →</strong><h3>${esc(st[0])}</h3>
  <p>🔁 What do you usually do? · 🏁 What happened in Geneva? · 📈 What have you learned?</p>
  <div class="timerbox"><button type="button" data-timer="${i}">⏱ Start 45 s</button><span class="timer" id="timer${i}">0:45</span></div>
  <button type="button" class="model small" data-target="rm${i}">👁 Model</button>
  <div class="models hidden" id="rm${i}"><ul><li>🔁 ${esc(replay[i][0])}</li><li>🏁 ${esc(replay[i][1])}</li><li>📈 ${esc(replay[i][2])}</li></ul>
  <button type="button" class="say small" data-speak="${esc(replay[i].join(' '))}">🔊 Listen</button></div></article>`).join('');
let timerId = null, timerIdx = null;
function stopTimer(){ if (timerId){ clearInterval(timerId); timerId = null; } if (timerIdx !== null){ const b = $(`[data-timer="${timerIdx}"]`); if (b) b.textContent = '⏱ Start 45 s'; } timerIdx = null; }
$('#raceReplayCards').addEventListener('click', e => {
  const b = e.target.closest('[data-timer]'); if (!b) return;
  const i = +b.dataset.timer, el = $('#timer' + i);
  if (timerIdx === i){ stopTimer(); el.textContent = '0:45'; el.className = 'timer'; return; }
  if (timerIdx !== null){ const prev = $('#timer' + timerIdx); prev.textContent = '0:45'; prev.className = 'timer'; }
  stopTimer();
  let left = 45; timerIdx = i; b.textContent = '■ Stop'; el.className = 'timer live'; el.textContent = '0:45';
  timerId = setInterval(() => {
    left--; el.textContent = `0:${String(left).padStart(2,'0')}`;
    if (left <= 0){ el.textContent = 'Time!'; el.className = 'timer end'; stopTimer(); }
  }, 1000);
});

/* Speaking prompts */
$('#oral').innerHTML = `<div class="split">` + oral.map((o, i) => `<div class="panel"><h3>${i + 1}. ${esc(o[0])}</h3><p>${esc(o[1])}</p>
  <button type="button" class="model" data-target="oral${i}">👁 Show B1 + B2 answers</button>
  <div class="models hidden" id="oral${i}"><b>Clear B1</b><p>${esc(o[2])}</p><button type="button" class="say small" data-speak="${esc(o[2])}">🔊 Listen</button>
  <b>Stretch B2</b><p>${esc(o[3])}</p><button type="button" class="say small" data-speak="${esc(o[3])}">🔊 Listen</button></div></div>`).join('') + `</div>`;

/* Recorder with timer and download */
let recorder = null, chunks = [], recStart = 0, recTick = null, recUrl = null;
$('#record').addEventListener('click', async () => {
  if (!navigator.mediaDevices || !window.MediaRecorder){ $('#recordStatus').textContent = 'Recording is not supported in this browser — use your phone’s voice recorder.'; return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
    recorder = new MediaRecorder(stream); chunks = [];
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      const type = recorder.mimeType || 'audio/webm';
      if (recUrl) URL.revokeObjectURL(recUrl);
      recUrl = URL.createObjectURL(new Blob(chunks, { type }));
      $('#playback').src = recUrl; $('#playback').classList.remove('hidden');
      const ext = /mp4|aac|m4a/.test(type) ? 'm4a' : /ogg/.test(type) ? 'ogg' : 'webm';
      const dl = $('#recDownload'); dl.href = recUrl; dl.download = `Antoine_race_commentary.${ext}`; dl.classList.remove('hidden');
      stream.getTracks().forEach(t => t.stop());
    };
    recorder.start(); recStart = Date.now();
    recTick = setInterval(() => { const s = Math.floor((Date.now() - recStart) / 1000); $('#recTimer').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2,'0')}`; }, 250);
    $('#record').disabled = true; $('#stop').disabled = false; $('#recordStatus').textContent = 'Recording… aim for 60–90 seconds.';
  } catch(err){ $('#recordStatus').textContent = 'Microphone unavailable. Allow access, or use your phone’s voice recorder.'; }
});
$('#stop').addEventListener('click', () => {
  if (recorder && recorder.state === 'recording') recorder.stop();
  clearInterval(recTick);
  $('#record').disabled = false; $('#stop').disabled = true;
  $('#recordStatus').textContent = 'Done! Listen back, then download if you want to send it.';
});

/* Writing with live checklist */
const irregularPast = 'was|were|went|drove|ran|felt|took|taught|had|did|got|made|came|saw|found|lost|left|kept|began|broke|thought|told|said|knew|became|gave|won|met|spent|flew|caught|brought|bought|sat|stood|put|set|chose|fell|grew|led|paid|wrote';
const participles = 'been|gone|done|seen|taken|taught|run|had|made|got|gotten|become|learnt|learned|found|lost|kept|felt|met|won|given|known|thought|told|said|spent|flown|caught|brought|bought|begun|broken|chosen|grown|written|\\w+ed';
const connectors = ['first','then','after that','as soon as','by the time','finally','although','because','so','but','however','since then'];
function analyse(t){
  const words = t.trim() ? t.trim().split(/\s+/).length : 0;
  const pp = (t.match(new RegExp(`\\b(have|has|haven't|hasn't|i've|we've|you've|they've|he's|she's)\\s+(never\\s+|already\\s+|just\\s+|ever\\s+|not\\s+|recently\\s+)?(${participles})\\b`, 'gi')) || []).length;
  const allPast = (t.match(new RegExp(`\\b(${irregularPast}|\\w{2,}ed)\\b`, 'gi')) || []).length;
  const did = (t.match(/\b(did|didn't)\b/gi) || []).length;
  const past = Math.max(0, allPast + did - pp);
  const low = ' ' + t.toLowerCase() + ' ';
  const conn = connectors.filter(c => new RegExp(`\\b${c}\\b`).test(low)).length;
  return { words, pp, past, conn };
}
$('#writingTasks').innerHTML = writing.map((w, i) => `<div class="writingtask"><h3>${w[0]}</h3><p>${esc(w[1])}</p>
  <div class="coach"><b>Before writing:</b> Who is reading this? What is the purpose? Decide on three real details. <b>Useful sequence:</b> introduce → describe the event → explain the result → reflect or close.</div><textarea id="write${i}" placeholder="Write your answer here…"></textarea>
  <div class="checklist" id="check${i}"></div>
  <button type="button" class="model" data-target="wm${i}">👁 Show B1 + B2 models</button>
  <div id="wm${i}" class="models hidden"><b>Clear B1</b><p>${esc(w[4])}</p><b>Stretch B2</b><p>${esc(w[5])}</p></div></div>`).join('');
function updateChecklist(i){
  const w = writing[i], a = analyse($('#write' + i).value);
  const chip = (ok, txt) => `<span class="${ok ? 'met' : ''}">${ok ? '✓' : '○'} ${txt}</span>`;
  $('#check' + i).innerHTML = chip(a.words >= w[2] && a.words <= w[3], `${a.words} words (${w[2]}–${w[3]})`) +
    chip(a.past >= 3, `past simple ≈ ${a.past} (aim 3+)`) + chip(a.pp >= 2, `present perfect ≈ ${a.pp} (aim 2+)`) + chip(a.conn >= 3, `connectors: ${a.conn} (aim 3+)`);
}
writing.forEach((_, i) => { $('#write' + i).addEventListener('input', () => { updateChecklist(i); store.set('antoine-hyrox-write' + i, $('#write' + i).value); }); const saved = store.get('antoine-hyrox-write' + i); if (saved) $('#write' + i).value = saved; updateChecklist(i); });

/* Booking story */
function sentenceCheck(v){
  v = v.trim();
  if (!v) return 'Write a complete sentence.';
  if (!/^[A-Z]/.test(v)) return 'Start with a capital letter.';
  if (!/[.!?]$/.test(v)) return 'End with a full stop.';
  if (/\bi\b/.test(v)) return 'Use a capital I.';
  if (/\b(did|didn't)\s+\w+\s+(went|stayed|drove|ran|took|booked|felt)\b/i.test(v) || /\b(did|didn't)\s+(went|stayed|drove|ran|took|booked|felt|finished)\b/i.test(v)) return 'After did/didn’t, use the base verb.';
  if (/\b(we|i|they|he|she)\s+(go|stay|drive|travel|book|feel|run|take|arrive|cross)\b/i.test(v)) return 'The weekend is finished — use the past form (went, stayed, drove, travelled, booked, felt, ran, took, arrived, crossed).';
  return '';
}
$('#bookingBuild').addEventListener('click', () => {
  const day = $('#raceDay').value, div = $('#division').value, stay = $('#stay').value.trim().replace(/[.!?]$/, ''), tr = $('#transport').value.trim();
  const issues = [];
  if (!day) issues.push('Choose your race day.'); if (!div) issues.push('Choose your division.'); if (!stay) issues.push('Enter your accommodation.'); if (!tr) issues.push('Write how you travelled.');
  const fb = $('#bookingFeedback');
  if (issues.length){ $('#bookingOut').textContent = ''; fb.innerHTML = `<span class="incorrect">✗ ${issues.join(' ')}</span>`; $('#bookingSay').disabled = true; return; }
  const err = sentenceCheck(tr);
  if (err){ $('#bookingOut').textContent = ''; fb.innerHTML = `<span class="incorrect">✗ Journey sentence: ${err}</span>`; $('#bookingSay').disabled = true; return; }
  const lodging = /^(an?|the|our|my)\b/i.test(stay) ? stay : 'an ' + stay;
  $('#bookingOut').textContent = `We booked ${lodging} for the race weekend. Our race was on ${day}, and we entered the ${div} division. ${tr} [Confirm your own check-in details.]`;
  fb.innerHTML = '<span class="neutral">◉ Draft built; formatting checks passed. Please confirm the facts and language with your teacher. This is not an accuracy grade.</span>'; 
  $('#bookingSay').disabled = false;
});
$('#bookingSay').addEventListener('click', () => speak($('#bookingOut').textContent));
$('#bookingHint').addEventListener('click', () => { $('#bookingFeedback').innerHTML = '<span class="neutral">💡 Choose the real day and division. For the journey, write a full past-simple sentence: “We drove across the border to Palexpo.”</span>'; });

/* Timeline */
['trip','hard','best'].forEach(id => $('#' + id).addEventListener('input', () => { $('#timelineFeedback').textContent = ''; }));
$('#timeline').addEventListener('click', () => {
  const parts = ['trip','hard','best'].map(id => $('#' + id).value.trim());
  const labels = ['Journey','Toughest moment','Best moment'];
  const errs = parts.map((p, i) => { const e = sentenceCheck(p); return e ? `${labels[i]}: ${e}` : ''; }).filter(Boolean);
  if (errs.length){ $('#timelineOut').textContent = ''; $('#timelineFeedback').innerHTML = `<span class="incorrect">✗ ${errs.join(' · ')}</span>`; return; }
  $('#timelineOut').textContent = parts.join(' ');
  $('#timelineFeedback').innerHTML = '<span class="neutral">◉ Basic formatting checks passed; grammar and meaning still need review. Add a detail to each sentence aloud.</span>'; 
});
$('#timelineHint').addEventListener('click', () => { $('#timelineFeedback').innerHTML = '<span class="neutral">💡 We stayed in Thonon-les-Bains. · The toughest station was the sled push. · My favourite moment was crossing the finish line together.</span>'; });

/* STAR builder */
$('#starBuild').addEventListener('click', () => {
  const parts = ['starS','starT','starA','starR'].map(id => $('#' + id).value.trim().replace(/([^.!?])$/, '$1.'));
  if (parts.some(p => p.length < 20)){ $('#starFeedback').innerHTML = '<span class="incorrect">✗ Write a meaningful sentence (at least 20 characters) for each STAR stage.</span>'; $('#starOut').textContent = ''; $('#starSay').disabled = true; return; }
  const text = parts.join(' ');
  $('#starOut').textContent = text;
  const a = analyse(text);
  const tips = [];
  if (parts.some(p => !/^[A-Z]/.test(p) || /\bi\b/.test(p))) tips.push('Check sentence capitals and always capitalize I.');
  if (a.past < 2) tips.push('Use more past simple in Situation and Action (took part, decided, changed…).');
  if (a.pp < 1) tips.push('Add a present perfect in the Result (This has taught me… / I have become…).');
  $('#starFeedback').innerHTML = tips.length ? `<span class="neutral">💡 ${tips.join(' ')}</span>` : '<span class="neutral">◉ Expected patterns detected, but this is not a grammar check. Confirm accuracy with your teacher; then speak without reading.</span>';
  $('#starSay').disabled = false;
});
$('#starSay').addEventListener('click', () => speak($('#starOut').textContent));

/* Generic delegated buttons: show/hide models, read aloud */
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.target){ const t = document.getElementById(b.dataset.target); if (t) t.classList.toggle('hidden'); }
  if (b.dataset.speak) speak(b.dataset.speak);
});

/* Copy answers */
async function copyText(text, msgEl, okMsg){
  try { await navigator.clipboard.writeText(text); msgEl.textContent = okMsg; }
  catch(e){
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); msgEl.textContent = okMsg; } catch(e2){ msgEl.textContent = 'Copy failed — please select the text manually.'; }
    ta.remove();
  }
}
$('#copyWork').addEventListener('click', () => {
  const text = `Antoine · HYROX Geneva Race Replay\nAuto-checked drills (not an English proficiency score): ${$('#count').textContent}\n\n` +
    writing.map((w, i) => `${w[0].replace(/^\S+\s/, '')}\n${$('#write' + i).value.trim() || '(not written)'}`).join('\n\n') +
    ($('#starOut').textContent ? `\n\nSTAR answer\n${$('#starOut').textContent}` : '');
  copyText(text, $('#copyMsg'), '✓ Copied — paste it into an email or message to Tisha.');
});

/* French help, print, reset */
$('#frToggle').addEventListener('click', () => {
  const on = document.body.classList.toggle('show-fr');
  $('#frToggle').setAttribute('aria-pressed', on); $('#frToggle').textContent = `🇫🇷 French help: ${on ? 'on' : 'off'}`;
  store.set('antoine-hyrox-fr', on ? '1' : '0');
});
if (store.get('antoine-hyrox-fr') === '1') $('#frToggle').click();
$('#printBtn').addEventListener('click', () => window.print());
$('#accent').value = store.get('antoine-hyrox-accent') || 'en-GB';
$('#accent').addEventListener('change', () => { store.set('antoine-hyrox-accent', $('#accent').value); $('#voiceNote').textContent = ''; });

$('#reset').addEventListener('click', () => {
  if (!confirm('Reset all exercises? (Your writing, feedback and admin notes are kept.)')) return;
  Object.keys(results).forEach(k => delete results[k]);
  $$('.choices button').forEach(b => b.classList.remove('right','wrong'));
  $$('.question, .drill').forEach(c => c.classList.remove('done'));
  $$('.question .feedback, .drill .feedback').forEach(f => f.innerHTML = '');
  $$('.drill input').forEach(i => i.value = '');
  ['raceDay','division','stay','transport','trip','hard','best','starS','starT','starA','starR','sportTransfer','workTransfer'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  ['bookingOut','timelineOut','starOut','bookingFeedback','timelineFeedback','starFeedback'].forEach(id=>{ const el=document.getElementById(id);if(el) el.textContent=''; });
  ['bookingSay','starSay'].forEach(id=>{const el=document.getElementById(id);if(el) el.disabled=true;});
  storyPicked = []; delete $('#storyPool').dataset.order; $('#storyFeedback').textContent = ''; renderStory();
  ['sportTransfer','workTransfer'].forEach(id=>store.set('antoine-l10-'+id,''));
  stopTimer(); $$('.timer').forEach(t => { t.textContent = '0:45'; t.className = 'timer'; });
  updateProgress();
});

/* Trainer admin (fiche pédagogique) */
const adminFields = [
  ['date','Date','date',''],['duration','Duration (min)','text','60'],['learner','Learner','text','Antoine'],
  ['title','Lesson title','text','HYROX Geneva · Race Replay'],['link','Lesson link','url',''],['mode','Mode','text','Online (visio)'],
  ['cert','Certification','text','VTEST'],['level','Level observed','text','Strong B1'],['score','Practice score','text','']
];
$('#adminFields').innerHTML = adminFields.map(([id, l, t, v]) => `<label>${l}<input id="a_${id}" type="${t}" value="${esc(v)}"></label>`).join('');
const adminCols = [...adminFields.map(f => f[1]), 'Objectives', 'Sections covered', 'Strengths', 'Areas to improve', 'Next step'];
function adminRow(){
  $('#a_score').value = $('#a_score').value || $('#count').textContent;
  return [...adminFields.map(f => $('#a_' + f[0]).value), ...['objectives','sections','strengths','needs','next'].map(id => $('#a_' + id).value)];
}
$('#copyAdmin').addEventListener('click', () => copyText(adminRow().map(s => String(s).replace(/[\t\r\n]+/g, ' ')).join('\t'), $('#adminMsg'), '✓ Row copied. Click the first empty cell in your sheet and paste.'));
$('#downloadAdmin').addEventListener('click', () => {
  const csv = v => '"' + String(v).replace(/"/g, '""') + '"';
  const blob = new Blob(['﻿' + adminCols.map(csv).join(';') + '\r\n' + adminRow().map(csv).join(';')], { type:'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Antoine_HYROX_fiche.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  $('#adminMsg').textContent = '✓ CSV downloaded (opens in Excel or Google Sheets).';
});

/* Qualiopi feedback */
let rating = +(store.get('antoine-hyrox-rating') || 0);
const starLabels = ['Not confident yet','A little confident','Quite confident','Confident','Very confident'];
$('#stars').innerHTML = [1,2,3,4,5].map(n => `<button type="button" role="radio" data-star="${n}" aria-label="${n} — ${starLabels[n-1]}" title="${starLabels[n-1]}">★</button>`).join('') + '<span id="starLabel" class="muted"></span>';
function paintStars(){ $$('[data-star]').forEach(b => { b.classList.toggle('on', +b.dataset.star <= rating); b.setAttribute('aria-checked', +b.dataset.star === rating); }); $('#starLabel').textContent = rating ? ` ${rating}/5 · ${starLabels[rating-1]}` : ''; }
$('#stars').addEventListener('click', e => { const b = e.target.closest('[data-star]'); if (!b) return; rating = +b.dataset.star; paintStars(); });
paintStars();
$('#evalBest').value = store.get('antoine-hyrox-best') || '';
$('#evalComment').value = store.get('antoine-hyrox-comment') || '';
$('#evalSave').addEventListener('click', () => {
  store.set('antoine-hyrox-rating', rating); store.set('antoine-hyrox-best', $('#evalBest').value); store.set('antoine-hyrox-comment', $('#evalComment').value);
  $('#evalMsg').textContent = '✓ Saved on this device. Thank you!';
});
$('#evalCopy').addEventListener('click', () => copyText(`Antoine · HYROX Geneva Race Replay — feedback\nConfidence: ${rating || '-'}/5\nMost useful: ${$('#evalBest').value || '-'}\nComment: ${$('#evalComment').value || '-'}`, $('#evalMsg'), '✓ Feedback copied.'));

updateProgress();

/* Lesson 10 revised: learner-specific speaking baseline and robust rubric. */
['baseline','raceFacts','sportTransfer','workTransfer','finalReflection'].forEach(id => {
 const el = document.getElementById(id); if(!el) return;
 el.value = store.get('antoine-l10-' + id) || '';
 el.addEventListener('input', () => store.set('antoine-l10-' + id, el.value));
});
const rubricDimensions = ['Coherence / structure','Past simple accuracy','Present perfect accuracy','Useful vocabulary','Intelligibility and fluency'];
const rubricBox = document.getElementById('fluencyRubric');
if(rubricBox) rubricBox.innerHTML = rubricDimensions.map((n,i) => `<label>${esc(n)}<select id="rub${i}"><option>Not yet assessed</option><option>Developing</option><option>Improving</option><option>Independent</option></select></label>`).join('');
const rubricText = () => rubricDimensions.map((n,i) => `${n}: ${$('#rub'+i).value}`).join('\n');
$('#compareTalk').addEventListener('click',()=>{
 const first=$('#baseline').value.trim(),last=$('#finalReflection').value.trim();
 $('#compareOut').textContent = first && last ? `First attempt:\n${first}\n\nSecond attempt / reflections:\n${last}\n\nDiscuss with your teacher: Which tense is more accurate? Which expressions make your story clearer?` : 'Record your first attempt and final reflection before comparing.';
});
$('#copyRubric').addEventListener('click',()=>copyText(`Antoine Lesson 10 — speaking observations\n${rubricText()}`, $('#rubricMsg'), '✓ Copied speaking rubric.'));
function updateStarCoach(){
 const career = $('#starContext').value === 'decathlon', guided = $('#starLevel').value === 'guided';
 const examples = career ? ['At Decathlon, our team needed to improve an existing workflow.','My role was to identify obstacles and make the process clearer.','I analysed the problem, consulted colleagues and suggested practical changes.','As a result, we had a clearer process. This has strengthened my problem-solving skills.'] : ['During HYROX Geneva, I faced a difficult physical challenge.','My aim was to manage my energy and complete the race.','I adjusted my approach to the demands of the competition.','The experience has strengthened my confidence and adaptability.'];
 const prompts = career ? ['Context: workflow/team/change','Your responsibility and target','Specific actions you personally took','Real outcome, evidence and learning'] : ['Place and sporting challenge','Your specific aim','What you did, not what other people did','Actual outcome and learning'];
 $('#starCoaching').innerHTML = `<b>${career?'Your real Decathlon example':'Your real HYROX example'} · ${guided?'guided B1':'independent B1+/B2'}</b><ol>${(guided?examples:prompts).map(v=>`<li>${esc(v)}</li>`).join('')}</ol><p class="note">Illustrative examples only. Replace assumptions with your real experiences; do not invent measurable results.</p>`;
}
$('#starContext').addEventListener('change',updateStarCoach);
$('#starLevel').addEventListener('change',updateStarCoach);
updateStarCoach();
