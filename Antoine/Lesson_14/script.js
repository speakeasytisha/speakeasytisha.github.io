/* Antoine · VTEST Final Masterclass · interactions */
(function () {
"use strict";

/* ---------- State ---------- */
const KEY = "antoine-final-vtest-v2";
let state;
function load() {
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { state = {}; }
  state.answers ||= {}; state.builders ||= {}; state.writing ||= {}; state.done ||= {}; state.best ||= {};
  if (state.fr === undefined) state.fr = true;
  if (state.accent === undefined) state.accent = "en-GB";
  if (state.family === undefined) state.family = 0;
  if (state.section === undefined) state.section = 0;
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
load();

let section = state.section, exam = false, mixedOn = false;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
function seeded(a, seed) { const b = [...a]; let s = seed * 9301 + 49297; for (let i = b.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
let timers = {};
function addTimer(g, t) { (timers[g] ||= []).push(t); }
function clearTimers(g) { Object.keys(timers).forEach(k => { if (!g || k === g) { timers[k].forEach(t => { clearInterval(t); clearTimeout(t); }); timers[k] = []; } }); }

/* ---------- Speech ---------- */
function pickVoice(lang) {
  const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  return vs.find(v => v.lang === lang) || vs.find(v => v.lang.replace("_", "-").startsWith(lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
function speak(text) {
  if (!("speechSynthesis" in window)) { alert("Speech synthesis is not supported by this browser."); return; }
  speechSynthesis.cancel();
  const clean = String(text).replace(/<[^>]+>/g, "").replace(/·/g, ",").replace(/___/g, "blank");
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = state.accent; u.rate = 0.9;
  const v = pickVoice(state.accent); if (v) u.voice = v;
  speechSynthesis.speak(u);
}
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};
const say = t => `<button class="listen" data-say="${esc(t)}" aria-label="Listen">🔊</button>`;

/* ---------- Particle colours ---------- */
const PCOL = {};
PARTICLES.forEach(p => p.p.split(" / ").forEach(k => PCOL[k.trim()] = p.color));
function pColor(part) { const first = part.replace(/[()]/g, " ").split(/[\s/]+/).filter(Boolean)[0]; return PCOL[first] || "#1f6f78"; }
const chip = part => `<span class="pchip" style="--pc:${pColor(part)}">${esc(part)}</span>`;

/* ---------- Score ---------- */
function updateScore() {
  const a = Object.values(state.answers), c = a.filter(x => x.correct).length;
  $("score").textContent = `${c} / ${a.length}`;
  $("bar").style.width = (a.length ? 100 * c / a.length : 0) + "%";
}

/* =========================================================
   TEACHING CONTENT
   ========================================================= */
const TEACH = [
/* ---- 0. Verb patterns ---- */
() => `
<div class="teach-grid">
  <div class="rule-card"><h4>Verb + TO + verb</h4><span class="formula">decide / want / hope / manage / agree / refuse / afford / plan / promise + TO</span>
    <p class="ex">I decided <b>to move</b> to Australia. · We managed <b>to save</b> $5,000.</p><p class="fr">Souvent un projet, une intention ou un résultat.</p></div>
  <div class="rule-card o"><h4>Verb + -ING</h4><span class="formula">enjoy / avoid / suggest / finish / mind / keep / consider / practise + -ING</span>
    <p class="ex">I enjoy <b>working</b> with people. · Avoid <b>making</b> the same mistake.</p><p class="fr">Souvent une activité en elle-même.</p></div>
  <div class="rule-card g"><h4>Preposition + -ING</h4><span class="formula">in / at / of / for / about / without + -ING</span>
    <p class="ex">I’m interested <b>in working</b> abroad. · Thank you <b>for calling</b>.</p><p class="fr">Après une préposition : toujours -ING.</p></div>
</div>
<div class="trap"><b>⚠ The TO trap:</b> in <i>look forward to</i>, <i>be used to</i>, <i>get used to</i>, <i>object to</i>, TO is a <b>preposition</b> → -ING.<br>
✔ I look forward to <b>hearing</b> from you. ✘ I look forward to hear from you.<span class="fr"><br>Test : si on peut mettre un nom après « to » (I look forward to <i>the weekend</i>), alors c’est une préposition → -ING.</span></div>
<h3 class="sub">Same verb, different meaning</h3>
<table class="ref"><tr><th>Verb</th><th>+ -ING</th><th>+ TO</th></tr>
<tr><td><b>stop</b></td><td>stop smoking = quit <span class="fr">(arrêter de)</span></td><td>stop to smoke = pause in order to smoke <span class="fr">(s’arrêter pour)</span></td></tr>
<tr><td><b>remember</b></td><td>remember meeting her = a memory of the past</td><td>remember to call = don’t forget (future)</td></tr>
<tr><td><b>forget</b></td><td>I’ll never forget visiting Uluru (memory)</td><td>Don’t forget to renew your visa (task)</td></tr>
<tr><td><b>try</b></td><td>try restarting it = experiment</td><td>try to finish = make an effort</td></tr></table>
<div class="coach"><b>VTEST tip:</b> in your speaking answers, use 2–3 of these patterns naturally: “I decided to…”, “I’m looking forward to…”, “I’m used to…”.</div>`,

/* ---- 1. Conditionals ---- */
() => `
<table class="ref"><tr><th>Type</th><th>Structure</th><th>Use</th><th>Example</th></tr>
<tr><td><b>Zero</b></td><td>If + present, present</td><td>facts, general truths</td><td class="ex">If you practise, you improve.</td></tr>
<tr><td><b>First</b></td><td>If + present, <b>will</b> + verb</td><td>real, possible future</td><td class="ex">If I pass, I’ll celebrate.</td></tr>
<tr><td><b>Second</b></td><td>If + past, <b>would</b> + verb</td><td>imaginary now / future</td><td class="ex">If I lived in Sydney, I’d surf every day.</td></tr>
<tr><td><b>Third</b></td><td>If + had + past participle, <b>would have</b> + past participle</td><td>imaginary past (regret)</td><td class="ex">If I’d prepared, I’d have felt calmer.</td></tr>
<tr><td><b>Mixed</b></td><td>If + had + past participle, <b>would</b> + verb (now)</td><td>past cause → present result</td><td class="ex">If I’d saved more, I’d be less stressed now.</td></tr></table>
<div class="teach-grid">
  <div class="rule-card o"><h4>No WILL after IF</h4><p>✔ If it <b>rains</b>, we’ll stay in.<br>✘ If it will rain…</p><p class="fr">Comme en français : « S’il pleut… » (pas « s’il pleuvra »).</p></div>
  <div class="rule-card"><h4>UNLESS = if not</h4><p class="ex">Unless the visa arrives, we won’t book. = If the visa doesn’t arrive…</p><p class="fr">unless = sauf si / à moins que</p></div>
  <div class="rule-card g"><h4>Advice: If I were you…</h4><p class="ex">If I were you, I would apply.</p><p class="fr">À ta place, je postulerais. (were pour toutes les personnes)</p></div>
</div>
<div class="coach"><b>Contractions to recognise when listening:</b> I’d = I would <i>or</i> I had · I’d have = I would have. Look at what follows: <i>I’d <b>go</b></i> (would) · <i>I’d <b>gone</b></i> (had).</div>`,

/* ---- 2. Passive ---- */
() => `
<div class="coach" style="font-size:18px"><b>Formula:</b> <span class="formula">BE (in the right tense) + PAST PARTICIPLE</span> &nbsp; (+ by + agent, only if useful)</div>
<table class="ref"><tr><th>Tense</th><th>Active</th><th>Passive</th></tr>
<tr><td>Present simple</td><td>They pay staff weekly.</td><td>Staff <b>are paid</b> weekly.</td></tr>
<tr><td>Present continuous</td><td>They are testing the system.</td><td>The system <b>is being tested</b>.</td></tr>
<tr><td>Past simple</td><td>The manager reviewed my CV.</td><td>My CV <b>was reviewed</b> (by the manager).</td></tr>
<tr><td>Present perfect</td><td>They have accepted the offer.</td><td>The offer <b>has been accepted</b>.</td></tr>
<tr><td>Future</td><td>They will provide training.</td><td>Training <b>will be provided</b>.</td></tr>
<tr><td>Modal</td><td>You must complete the form.</td><td>The form <b>must be completed</b>.</td></tr></table>
<div class="teach-grid">
  <div class="rule-card"><h4>When to use it</h4><p>The action or result matters more than the person: reports, processes, job ads, official rules.</p><p class="fr">Très fréquent dans les écrits professionnels.</p></div>
  <div class="rule-card o"><h4>Keep the tense</h4><p>Only BE changes tense. The main verb is <b>always</b> a past participle.</p></div>
  <div class="rule-card g"><h4>Useful for your CV</h4><p class="ex">A new workflow <b>was implemented</b> and costs <b>were reduced</b> by 15%.</p></div>
</div>`,

/* ---- 3. Relative clauses ---- */
() => `
<table class="ref"><tr><th>Pronoun</th><th>For</th><th>Example</th><th class="fr-block">Français</th></tr>
<tr><td><b>who</b></td><td>people</td><td class="ex">The recruiter <b>who</b> called me…</td><td class="fr-block fr">qui</td></tr>
<tr><td><b>whose</b></td><td>possession (people &amp; things)</td><td class="ex">The recruiter <b>whose</b> agency…</td><td class="fr-block fr">dont le/la/les · à qui</td></tr>
<tr><td><b>which</b></td><td>things</td><td class="ex">The visa, <b>which</b> costs $650, …</td><td class="fr-block fr">qui / que / lequel</td></tr>
<tr><td><b>that</b></td><td>people or things (defining only)</td><td class="ex">The job <b>that</b> I want…</td><td class="fr-block fr">qui / que</td></tr>
<tr><td><b>where</b></td><td>places</td><td class="ex">The farm <b>where</b> I worked…</td><td class="fr-block fr">où</td></tr>
<tr><td><b>when</b></td><td>time</td><td class="ex">The day <b>when</b> I arrived…</td><td class="fr-block fr">où (temps)</td></tr></table>

<h3 class="sub"><span class="pill">FOCUS</span> WHO or WHOSE? Never confuse them again</h3>
<div class="vs">
  <div class="vs-col who"><h4>WHO</h4><p class="big">= the person who DOES the action</p><p class="fr">= qui</p>
    <ul><li>replaces <b>he / she / they</b> (the subject)</li><li>is followed by a <b>VERB</b></li><li>only for <b>people</b></li></ul>
    <p class="ex" style="color:#fff">The candidate <u>who</u> <b>speaks</b> English got the job.</p></div>
  <div class="vs-mid">vs</div>
  <div class="vs-col whose"><h4>WHOSE</h4><p class="big">= something that BELONGS to the person</p><p class="fr">= dont le / la / les · à qui</p>
    <ul><li>replaces <b>his / her / their / its</b></li><li>is followed by a <b>NOUN</b></li><li>for <b>people</b> and <b>things</b> (companies, countries…)</li></ul>
    <p class="ex" style="color:#fff">The candidate <u>whose</u> <b>CV</b> impressed us got the job.</p></div>
</div>

<h3 class="sub">The 3-step test</h3>
<ol class="test-steps">
  <li><b>Look at the word right after the gap.</b><br>A <span class="hl-verb">verb</span> (works, helped, is, called) → <span class="hl-who">who</span>. &nbsp; A <span class="hl-noun">noun</span> (company, CV, passport, house) → <span class="hl-whose">whose</span>.</li>
  <li><b>Split it back into two sentences.</b><br>If the second sentence starts with <b>he / she / they</b> → <span class="hl-who">who</span>. If it has <b>his / her / their / its</b> + noun → <span class="hl-whose">whose</span>.</li>
  <li><b>Check in French.</b><br>« le candidat <b>qui</b> parle anglais » → <span class="hl-who">who</span> · « le candidat <b>dont le</b> CV nous a impressionnés » → <span class="hl-whose">whose</span>.<span class="fr"> Attention : « dont » ne se traduit pas toujours par whose (« le poste dont je parle » = the job I’m talking about). Whose = dont + <b>le/la/les + nom</b>.</span></li>
</ol>

<table class="ref"><tr><th>Two sentences</th><th>One sentence</th></tr>
<tr><td>I met a recruiter. <b>She</b> <span class="hl-verb">works</span> for Qantas.</td><td>I met a recruiter <span class="hl-who">who</span> <span class="hl-verb">works</span> for Qantas.</td></tr>
<tr><td>I met a recruiter. <b>Her</b> <span class="hl-noun">agency</span> hires in Perth.</td><td>I met a recruiter <span class="hl-whose">whose</span> <span class="hl-noun">agency</span> hires in Perth.</td></tr>
<tr><td>I worked for a company. <b>Its</b> <span class="hl-noun">headquarters</span> are in Lyon.</td><td>I worked for a company <span class="hl-whose">whose</span> <span class="hl-noun">headquarters</span> are in Lyon.</td></tr>
<tr><td>Who is responsible? / Whose <span class="hl-noun">bag</span> is this?</td><td>Questions work the same way: <b>who</b> + verb · <b>whose</b> + noun</td></tr></table>

<div class="teach-grid">
  <div class="trap" style="margin:0"><b>⚠ WHO’S ≠ WHOSE</b> — they sound exactly the same!<br><b>who’s</b> = who <b>is</b> / who <b>has</b>: <i>She’s the one who’s in charge.</i><br><b>whose</b> = possession: <i>Whose turn is it?</i><br>Test: can you say “who is”? → who’s.</div>
  <div class="trap" style="margin:0"><b>⚠ No article after WHOSE</b><br>✘ the man whose <s>the</s> car broke down<br>✔ the man <b>whose car</b> broke down<span class="fr"><br>« dont <b>la</b> voiture » → whose car (pas de « the »).</span></div>
  <div class="coach" style="margin:0"><b>Object WHO:</b> The manager (who / that) I spoke to was helpful. → no noun after the gap, so it’s <b>who</b>, and you can even leave it out.</div>
</div>
<div class="coach"><b>Commas:</b> extra information (non-defining) → commas, and <b>never “that”</b>: <i>My partner, who is a nurse, wants to work in Sydney.</i></div>

<h3 class="sub"><span class="pill">TRY IT</span> Join the two sentences: WHO or WHOSE?</h3>
<div id="joins"></div>`,

/* ---- 4. Phrasal verbs ---- */
() => `
<div class="coach" style="font-size:17px"><b>How phrasal verbs work:</b> <span class="formula">VERB + SMALL WORD (particle) = NEW MEANING</span><br>
The small word is <b>not random</b>: it carries an idea (direction, completion, separation…). Learn the idea first, then each phrasal verb becomes logical.
<span class="fr"><br>Les petits mots (up, out, into, off…) ont un sens à eux. Comprenez d’abord ce sens, puis observez comment chaque verbe change.</span></div>

<h3 class="sub"><span class="pill">STEP 1</span> What do the small words mean?</h3>
<div class="particle-grid">${PARTICLES.map(p => `
  <div class="particle" style="--pc:${p.color}"><div class="p">${p.icon} ${esc(p.p)}</div>
    <div class="core">${esc(p.core)}</div><div class="fr">${esc(p.fr)}</div>
    <div class="pic">🖼 ${esc(p.picture)}</div>
    <ul>${p.ex.map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>`).join("")}
</div>
<div class="trap"><b>⚠ These are tendencies, not absolute rules.</b> Some phrasal verbs are idiomatic (<i>take after</i> = ressembler à). But the particle idea helps you guess and remember most of them.</div>

<h3 class="sub"><span class="pill">STEP 2</span> One verb, many meanings</h3>
<p class="small">Choose a verb. Watch how each small word transforms it. Press 🔊 to hear the example.</p>
<div class="family-tabs" id="familyTabs">${FAMILIES.map((f, i) => `<button data-fam="${i}" class="${i === state.family ? "active" : ""}">${esc(f.verb)}</button>`).join("")}</div>
<div id="familyView"></div>

<h3 class="sub"><span class="pill">STEP 3</span> Grammar: where does the object go?</h3>
<div class="teach-grid">
  <div class="rule-card g"><h4>Separable <span class="tag S">SEP</span></h4><p>Noun: both positions OK.<br><i>Fill out <b>the form</b>. / Fill <b>the form</b> out.</i></p><p>Pronoun: <b>always in the middle</b>.<br>✔ Fill <b>it</b> out. ✘ Fill out it.<br>✔ Pick <b>me</b> up. ✘ Pick up me.</p></div>
  <div class="rule-card r"><h4>Inseparable <span class="tag I">INSEP</span></h4><p>The object always comes <b>after</b> the particle.<br>✔ Look after <b>the kids</b> / look after <b>them</b>.<br>✘ Look them after.</p><p class="fr">Ex. : look after, look into, get on, get over, run into, come across.</p></div>
  <div class="rule-card y"><h4>Three-part verbs</h4><p>Always inseparable: <i>put up with, run out of, look forward to, come up with, get along with, follow up on</i>.</p><p>After a preposition → -ING: <i>I look forward to <b>meeting</b> you.</i></p></div>
</div>
<h3 class="sub">Speaking vs formal writing</h3>
<p class="small">Phrasal verbs are perfect for speaking. In a formal email or essay you can also use a one-word equivalent — knowing both helps you in the VTEST.</p>
<table class="ref"><tr><th>Phrasal verb (neutral / spoken)</th><th>Formal equivalent</th><th class="fr-block">Français</th></tr>
<tr><td>look into</td><td>investigate</td><td class="fr fr-block">examiner</td></tr><tr><td>put off</td><td>postpone</td><td class="fr fr-block">reporter</td></tr>
<tr><td>find out</td><td>discover</td><td class="fr fr-block">découvrir</td></tr><tr><td>turn down</td><td>reject / decline</td><td class="fr fr-block">refuser</td></tr>
<tr><td>set up</td><td>establish</td><td class="fr fr-block">créer</td></tr><tr><td>carry out</td><td>conduct / perform</td><td class="fr fr-block">effectuer</td></tr>
<tr><td>go up</td><td>increase</td><td class="fr fr-block">augmenter</td></tr><tr><td>take on</td><td>hire / recruit</td><td class="fr fr-block">embaucher</td></tr></table>`
];

function bindTeaching() {
  if (section === 3) renderJoins();
  if (section === 4) {
    document.querySelectorAll("[data-fam]").forEach(b => b.onclick = () => {
      state.family = +b.dataset.fam; save();
      document.querySelectorAll("[data-fam]").forEach(x => x.classList.toggle("active", x === b));
      renderFamily();
    });
    renderFamily();
  }
}

function renderFamily() {
  const f = FAMILIES[state.family] || FAMILIES[0];
  const tagTxt = t => t === "S" ? '<span class="tag S">SEPARABLE</span>' : t === "I" ? '<span class="tag I">INSEPARABLE</span>' : '<span class="tag N">NO OBJECT</span>';
  $("familyView").innerHTML = `
  <div class="family-head"><span class="v">${esc(f.verb.toUpperCase())}</span><span>alone = ${esc(f.base)}</span><span class="fr">${esc(f.fr)}</span><span style="margin-left:auto;font-size:14px;opacity:.85">${f.rows.length} phrasal verbs</span></div>
  <div class="pv-list">${f.rows.map(r => `
    <div class="pv">
      <div><div class="name">${esc(r[1])}</div>${chip(r[0])}<br>${tagTxt(r[5])}</div>
      <div><div class="eq">= <b>${esc(r[2])}</b> <span class="fr">· ${esc(r[3])}</span></div>
        <div class="exs">${esc(r[4])}</div><div class="why">${esc(r[6])}</div></div>
      <div>${say(r[4])}</div>
    </div>`).join("")}</div>`;
}

function renderJoins() {
  const box = $("joins"); if (!box) return;
  state.joins ||= {};
  box.innerHTML = JOINS.map((j, i) => {
    const got = state.joins[i];
    return `<div class="join-item" data-join="${i}">
      <div class="pair"><span class="s">${esc(j.a)}</span><span>+</span><span class="s">${esc(j.b)}</span></div>
      <div class="options"><button data-jv="who" class="${got ? (j.answer === "who" ? "correct" : got === "who" ? "wrong" : "") : ""}">who</button><button data-jv="whose" class="${got ? (j.answer === "whose" ? "correct" : got === "whose" ? "wrong" : "") : ""}">whose</button></div>
      <div class="res">${got ? (got === j.answer ? "✓ " : "✕ Not quite — ") + j.joined + ` <span class="small">(${esc(j.why)})</span>` : ""}</div></div>`;
  }).join("");
  box.querySelectorAll("[data-join]").forEach(el => el.querySelectorAll("[data-jv]").forEach(b => b.onclick = () => {
    state.joins[+el.dataset.join] = b.dataset.jv; save(); renderJoins();
  }));
}

/* =========================================================
   QUESTIONS
   ========================================================= */
const optCache = {};
function questionHtml(q, prefix, n) {
  const k = prefix + q.id, a = state.answers[k];
  optCache[k] ||= shuffle(q.options);
  const sec = prefix === "mixed" ? `<div class="q-section">${esc(MODULES[q.s].short)}</div>` : "";
  return `<div class="q" data-q="${q.id}" data-prefix="${prefix}">${sec}
    <h3><span class="num">${n}.</span>${esc(q.stem)}</h3>
    <div class="options">${optCache[k].map(o => `<button class="${a && a.selected === o ? (a.correct ? "correct" : "wrong") : ""}" data-choice="${encodeURIComponent(o)}">${esc(o)}</button>`).join("")}</div>
    <div class="feedback ${a ? (a.correct ? "ok" : "bad") : ""}" aria-live="polite">${a ? (a.correct ? "✓ Correct! " + (exam ? "" : esc(q.hint)) : "✕ Not quite. Try again.") : ""}</div>
    ${exam ? "" : `<div class="q-tools"><button class="hintBtn">💡 Hint</button><button class="answerBtn">👁 Show answer</button><button class="sayBtn">🔊 Listen</button></div><div class="hint"></div>`}
  </div>`;
}
function bindQuestions(root) {
  root.querySelectorAll(".q").forEach(el => {
    const q = QUESTIONS[+el.dataset.q], prefix = el.dataset.prefix;
    el.querySelectorAll("[data-choice]").forEach(b => b.onclick = () => {
      const selected = decodeURIComponent(b.dataset.choice), correct = selected === q.answer;
      state.answers[prefix + q.id] = { selected, correct }; save();
      el.querySelectorAll("[data-choice]").forEach(x => { x.classList.remove("correct", "wrong"); if (x === b) x.classList.add(correct ? "correct" : "wrong"); });
      const fb = el.querySelector(".feedback");
      fb.className = "feedback " + (correct ? "ok" : "bad");
      fb.textContent = correct ? "✓ Correct! " + (exam ? "" : q.hint) : "✕ Not quite. Try again." + (exam ? "" : " Use the hint or try another option.");
      updateScore();
    });
    if (!exam) {
      el.querySelector(".hintBtn").onclick = () => el.querySelector(".hint").textContent = "💡 " + q.hint;
      el.querySelector(".answerBtn").onclick = () => el.querySelector(".hint").textContent = "Answer: " + q.answer + " · " + q.hint;
      el.querySelector(".sayBtn").onclick = () => speak(q.stem.replace("___", q.answer));
    }
  });
}

/* =========================================================
   GAMES
   ========================================================= */
function bestOf(key, score) { const b = state.best[key] || 0; if (score > b) { state.best[key] = score; save(); return { best: score, isNew: true }; } return { best: b, isNew: false }; }

/* Generic quick-fire engine */
function quickGame(el, cfg) {
  let queue, i, score, streak, left, tick;
  const intro = () => {
    el.innerHTML = `<div class="game-box"><div class="game-title"><h3>${cfg.title}</h3><div class="game-stats"><span class="gstat">🏆 Best: ${state.best[cfg.key] || 0}</span></div></div>
      <p>${cfg.desc}</p><div class="btn-row"><button class="primary go">▶ Start</button></div></div>`;
    el.querySelector(".go").onclick = start;
  };
  const start = () => {
    queue = shuffle(cfg.items).slice(0, cfg.limit || cfg.items.length); i = 0; score = 0; streak = 0; left = cfg.seconds || 0;
    if (cfg.seconds) { tick = setInterval(() => { left--; const t = el.querySelector(".timer > div"); if (t) t.style.width = (100 * left / cfg.seconds) + "%"; const lt = el.querySelector(".left"); if (lt) lt.textContent = "⏱ " + left + "s"; if (left <= 0) { clearInterval(tick); end(); } }, 1000); addTimer(cfg.group || "module", tick); }
    next();
  };
  const next = () => {
    if (!cfg.seconds && i >= queue.length) return end();
    if (cfg.seconds && i >= queue.length) { queue = queue.concat(shuffle(cfg.items)); }
    const it = queue[i], opts = cfg.opts(it);
    el.innerHTML = `<div class="game-box"><div class="game-title"><h3>${cfg.title}</h3><div class="game-stats">
      ${cfg.seconds ? `<span class="gstat hot left">⏱ ${left}s</span>` : `<span class="gstat">${i + 1} / ${queue.length}</span>`}
      <span class="gstat">✓ ${score}</span><span class="gstat hot">🔥 ${streak}</span></div></div>
      ${cfg.seconds ? `<div class="timer"><div style="width:${100 * left / cfg.seconds}%"></div></div>` : ""}
      ${cfg.before ? cfg.before(it) : ""}<div class="prompt-big">${cfg.prompt(it)}</div>
      <div class="game-opts ${cfg.stack ? "stack" : ""}">${opts.map(o => `<button data-o="${encodeURIComponent(o)}">${esc(o)}</button>`).join("")}</div>
      <div class="game-fb"></div></div>`;
    let locked = false;
    el.querySelectorAll("[data-o]").forEach(b => b.onclick = () => {
      if (locked) return; locked = true;
      const pick = decodeURIComponent(b.dataset.o), ok = pick === cfg.ans(it);
      if (ok) { score++; streak++; } else streak = 0;
      b.classList.add(ok ? "correct" : "wrong");
      if (!ok) el.querySelectorAll("[data-o]").forEach(x => { if (decodeURIComponent(x.dataset.o) === cfg.ans(it)) x.classList.add("correct"); });
      el.querySelector(".game-fb").innerHTML = ok ? `<span style="color:var(--green)">✓ ${cfg.good ? cfg.good(it) : "Correct!"}</span>` : `<span style="color:var(--red)">✕ ${cfg.bad ? cfg.bad(it) : "Answer: " + esc(cfg.ans(it))}</span>`;
      i++; const t = setTimeout(() => { if (cfg.seconds && left <= 0) return; next(); }, ok ? 650 : 1500); addTimer(cfg.group || "module", t);
    });
  };
  const end = () => {
    clearInterval(tick);
    const r = bestOf(cfg.key, score);
    el.innerHTML = `<div class="game-box"><div class="game-title"><h3>${cfg.title}</h3></div>
      <div class="celebrate">${score >= (cfg.seconds ? 10 : queue.length * 0.8) ? "🎉" : "💪"} Score: ${score}${cfg.seconds ? "" : " / " + queue.length}${r.isNew ? " · New best score!" : ""}</div>
      <p style="text-align:center">🏆 Best: ${r.best}</p><div class="btn-row" style="justify-content:center"><button class="primary go">↻ Play again</button></div></div>`;
    el.querySelector(".go").onclick = start;
  };
  intro();
}

/* Match engine (left ↔ right) */
function matchGame(el, cfg) {
  const pairs = shuffle(cfg.pairs).slice(0, cfg.n || 6);
  const L = shuffle(pairs.map((p, i) => ({ i, t: p[0] }))), R = shuffle(pairs.map((p, i) => ({ i, t: p[1] })));
  let selL = null, selR = null, found = 0, tries = 0;
  el.innerHTML = `<div class="game-box"><div class="game-title"><h3>${cfg.title}</h3><div class="game-stats"><span class="gstat mfound">✓ 0 / ${pairs.length}</span><span class="gstat mtries">Attempts: 0</span></div></div>
    <p class="small">${cfg.desc}</p>
    <div class="match"><div class="col">${L.map(x => `<button data-l="${x.i}">${cfg.lhtml ? cfg.lhtml(x.t) : esc(x.t)}</button>`).join("")}</div>
    <div class="col">${R.map(x => `<button data-r="${x.i}">${esc(x.t)}</button>`).join("")}</div></div>
    <div class="game-fb"></div><div class="btn-row" style="justify-content:center"><button class="soft again">↻ New round</button></div></div>`;
  const check = () => {
    if (selL === null || selR === null) return;
    tries++; el.querySelector(".mtries").textContent = "Attempts: " + tries;
    const lb = el.querySelector(`[data-l="${selL}"]`), rb = el.querySelector(`[data-r="${selR}"]`);
    if (selL === selR) {
      lb.className = rb.className = "done"; lb.disabled = rb.disabled = true; found++;
      el.querySelector(".mfound").textContent = `✓ ${found} / ${pairs.length}`;
      el.querySelector(".game-fb").innerHTML = `<span style="color:var(--green)">✓ ${cfg.note ? cfg.note(pairs[selL]) : "Match!"}</span>`;
      if (found === pairs.length) { const r = bestOf(cfg.key, Math.max(0, 100 - (tries - pairs.length) * 10)); el.querySelector(".game-fb").innerHTML = `<div class="celebrate">🎉 All matched in ${tries} attempts! (accuracy score ${Math.max(0, 100 - (tries - pairs.length) * 10)} · best ${r.best})</div>`; }
    } else {
      lb.classList.add("bad"); rb.classList.add("bad");
      el.querySelector(".game-fb").innerHTML = `<span style="color:var(--red)">✕ Not a pair — try again.</span>`;
      setTimeout(() => { lb.classList.remove("bad", "sel"); rb.classList.remove("bad", "sel"); }, 400);
    }
    selL = selR = null;
  };
  el.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { el.querySelectorAll("[data-l]").forEach(x => x.classList.remove("sel")); b.classList.add("sel"); selL = +b.dataset.l; check(); });
  el.querySelectorAll("[data-r]").forEach(b => b.onclick = () => { el.querySelectorAll("[data-r]").forEach(x => x.classList.remove("sel")); b.classList.add("sel"); selR = +b.dataset.r; check(); });
  el.querySelector(".again").onclick = () => matchGame(el, cfg);
}

/* Verb sorter (click or drag) */
function sorterGame(el) {
  const pick = shuffle(SORT_ITEMS.filter(x => x[1] === "to")).slice(0, 4).concat(shuffle(SORT_ITEMS.filter(x => x[1] === "ing")).slice(0, 4), shuffle(SORT_ITEMS.filter(x => x[1] === "prep")).slice(0, 4));
  const items = shuffle(pick);
  let sel = null, score = 0, errors = 0;
  const example = it => it[1] === "to" ? `${it[0]} + TO → I ${it[0]} to go.` : it[1] === "ing" ? `${it[0]} + -ING → I ${it[0]} going.` : `${it[0]} + -ING → ${it[0]} going.`;
  el.innerHTML = `<div class="game-box"><div class="game-title"><h3>🗂 Verb pattern sorter</h3><div class="game-stats"><span class="gstat sc">✓ 0 / ${items.length}</span><span class="gstat er">Errors: 0</span></div></div>
    <p class="small">Click a word, then click the right box (or drag it). <span class="fr">Cliquez sur un mot puis sur la bonne case.</span></p>
    <div class="card-pool">${items.map((it, i) => `<button class="scard" draggable="true" data-i="${i}">${esc(it[0])}</button>`).join("")}</div>
    <div class="bins">${Object.entries(SORT_BINS).map(([k, v]) => `<div class="bin" data-bin="${k}"><h4>${v}</h4></div>`).join("")}</div>
    <div class="game-fb"></div><div class="btn-row" style="justify-content:center"><button class="soft again">↻ New words</button></div></div>`;
  const place = (i, bin) => {
    const it = items[i], card = el.querySelector(`.scard[data-i="${i}"]`); if (!card) return;
    if (it[1] === bin) {
      card.remove(); score++;
      el.querySelector(`[data-bin="${bin}"]`).insertAdjacentHTML("beforeend", `<span class="placed">${esc(it[0])}</span>`);
      el.querySelector(".game-fb").innerHTML = `<span style="color:var(--green)">✓ ${esc(example(it))}</span>`;
    } else {
      errors++; card.classList.add("shake"); setTimeout(() => card.classList.remove("shake"), 400);
      el.querySelector(".game-fb").innerHTML = `<span style="color:var(--red)">✕ “${esc(it[0])}” is not ${SORT_BINS[bin]}. Try another box.</span>`;
    }
    sel = null; el.querySelectorAll(".scard").forEach(c => c.classList.remove("sel")); el.querySelectorAll(".bin").forEach(b => b.classList.remove("ready"));
    el.querySelector(".sc").textContent = `✓ ${score} / ${items.length}`; el.querySelector(".er").textContent = "Errors: " + errors;
    if (score === items.length) { const r = bestOf("sorter", Math.max(0, items.length - errors)); el.querySelector(".game-fb").innerHTML = `<div class="celebrate">🎉 All sorted with ${errors} error(s)! Best: ${r.best} / ${items.length}</div>`; }
  };
  el.querySelectorAll(".scard").forEach(c => {
    c.onclick = () => { el.querySelectorAll(".scard").forEach(x => x.classList.remove("sel")); c.classList.add("sel"); sel = +c.dataset.i; el.querySelectorAll(".bin").forEach(b => b.classList.add("ready")); };
    c.ondragstart = e => { e.dataTransfer.setData("text/plain", c.dataset.i); };
  });
  el.querySelectorAll(".bin").forEach(b => {
    b.onclick = () => { if (sel !== null) place(sel, b.dataset.bin); };
    b.ondragover = e => { e.preventDefault(); b.classList.add("over"); };
    b.ondragleave = () => b.classList.remove("over");
    b.ondrop = e => { e.preventDefault(); b.classList.remove("over"); place(+e.dataTransfer.getData("text/plain"), b.dataset.bin); };
  });
  el.querySelector(".again").onclick = () => sorterGame(el);
}

/* Memory (phrasal verb ↔ meaning) */
function memoryGame(el) {
  const seen = new Set(), rows = shuffle(FAMILIES.flatMap(f => f.rows).filter(r => !r[1].includes("/"))).filter(r => { const k = state.fr ? r[3] : r[2]; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);
  const cards = shuffle(rows.flatMap((r, i) => [{ i, t: r[1], k: "pv" }, { i, t: state.fr ? r[3] : r[2], k: "m" }]));
  let up = [], found = 0, moves = 0, lock = false;
  el.innerHTML = `<div class="game-box"><div class="game-title"><h3>🧠 Memory · phrasal verb ↔ meaning</h3><div class="game-stats"><span class="gstat mf">✓ 0 / 6</span><span class="gstat mm">Moves: 0</span></div></div>
    <p class="small">Turn over two cards: find each phrasal verb and its meaning (${state.fr ? "in French — turn FR help off for English meanings" : "in English"}).</p>
    <div class="memory">${cards.map((c, n) => `<button class="mem ${c.k === "m" && state.fr ? "fr-card" : ""}" data-n="${n}" aria-label="card">${esc(c.t)}</button>`).join("")}</div>
    <div class="game-fb"></div><div class="btn-row" style="justify-content:center"><button class="soft again">↻ New cards</button></div></div>`;
  el.querySelectorAll(".mem").forEach(b => b.onclick = () => {
    if (lock || b.classList.contains("up") || b.classList.contains("found")) return;
    b.classList.add("up"); up.push(b);
    if (up.length === 2) {
      moves++; el.querySelector(".mm").textContent = "Moves: " + moves;
      const [a, c] = up.map(x => cards[+x.dataset.n]);
      if (a.i === c.i && a.k !== c.k) {
        up.forEach(x => { x.classList.remove("up"); x.classList.add("found"); }); found++; up = [];
        el.querySelector(".mf").textContent = `✓ ${found} / 6`;
        const r = rows[a.i]; el.querySelector(".game-fb").innerHTML = `<span style="color:var(--green)">✓ ${esc(r[1])} = ${esc(r[2])} · <i>${esc(r[4])}</i></span>`;
        if (found === 6) { const s = bestOf("memory", Math.max(0, 100 - (moves - 6) * 5)); el.querySelector(".game-fb").innerHTML = `<div class="celebrate">🎉 Finished in ${moves} moves! Best score: ${s.best}</div>`; }
      } else { lock = true; setTimeout(() => { up.forEach(x => x.classList.remove("up")); up = []; lock = false; }, 900); }
    }
  });
  el.querySelector(".again").onclick = () => memoryGame(el);
}

/* Particle wheel items */
function wheelItems() {
  return FAMILIES.flatMap(f => f.rows).filter(r => !/[\/()]/.test(r[1])).map(r => {
    const parts = r[1].split(" "); return { verb: parts[0], part: parts.slice(1).join(" "), en: r[2], fr: r[3], ex: r[4], pv: r[1] };
  });
}
const ALL_PARTS = [...new Set(wheelItems().map(x => x.part))];

/* Game per module */
const GAMES = [
  el => sorterGame(el),
  el => matchGame(el, { title: "🔀 Match the halves", key: "halves", pairs: HALVES.map(h => [h[0], h[1], h[2]]), n: 6,
      desc: "Click an IF-clause, then the result that completes it correctly.", note: p => `${p[2]} conditional: ${p[0]} ${p[1]}` }),
  el => quickGame(el, { title: "⚙️ Passive transformer", key: "passive", items: PASSIVE_GAME, stack: true,
      desc: "Read the active sentence and choose the correct passive version. Build a streak! 🔥",
      prompt: it => "“" + esc(it.prompt) + "”", opts: it => shuffle(it.options), ans: it => it.answer,
      good: it => "BE + past participle", bad: it => "Correct passive: " + esc(it.answer) }),
  el => quickGame(el, { title: "⚡ Who · Whose · Who’s dash", key: "whodash", items: WHO_GAME, seconds: 45,
      desc: "45 seconds! Look at the word after the gap: a verb → who · a noun → whose · “who is” → who’s. Also: which (things) and where (places).",
      prompt: it => esc(it.prompt).replace("___", "<u>&nbsp;&nbsp;?&nbsp;&nbsp;</u>"), opts: () => WHO_OPTIONS, ans: it => it.answer }),
  el => {
    const tabs = [["wheel", "🎡 Particle wheel"], ["memory", "🧠 Memory"], ["pmatch", "🔤 Small-word match"]];
    state.pgame ||= "wheel";
    el.innerHTML = `<div class="game-switch">${tabs.map(t => `<button data-pg="${t[0]}" class="${state.pgame === t[0] ? "active" : ""}">${t[1]}</button>`).join("")}</div><div id="pgame"></div>`;
    el.querySelectorAll("[data-pg]").forEach(b => b.onclick = () => { state.pgame = b.dataset.pg; save(); clearTimers("module"); GAMES[4](el); });
    const box = $("pgame");
    if (state.pgame === "memory") memoryGame(box);
    else if (state.pgame === "pmatch") matchGame(box, { title: "🔤 Small-word match", key: "pmatch",
      pairs: PARTICLES.map(p => [p.p, p.core.split(" · ").slice(0, 2).join(" · "), p]), n: 6,
      desc: "Match each small word with its core idea. This is the key to guessing phrasal verbs!",
      lhtml: t => `<span class="pchip" style="--pc:${PCOL[t.split(" / ")[0]] || "#1f6f78"}">${esc(t)}</span>`,
      note: p => `${p[0]} → e.g. ${p[2].ex[0]}` });
    else quickGame(box, { title: "🎡 Particle wheel", key: "wheel", items: wheelItems(), limit: 10,
      desc: "You see a verb and a meaning. Which small word completes the phrasal verb? 10 rounds.",
      before: it => `<div class="wheel-verb">${esc(it.verb.toUpperCase())} <span class="wheel-plus">+ ?</span></div>`,
      prompt: it => `= ${esc(it.en)}${state.fr ? ` <span class="fr" style="font-size:17px">(${esc(it.fr)})</span>` : ""}`,
      opts: it => shuffle([it.part, ...shuffle(ALL_PARTS.filter(p => p !== it.part)).slice(0, 3)]), ans: it => it.part,
      good: it => `${it.pv} — “${it.ex}”`, bad: it => `It’s <b>${esc(it.pv)}</b> — “${esc(it.ex)}”` });
  }
];

/* =========================================================
   BUILDER
   ========================================================= */
function renderBuilder() {
  const set = BUILDS[section];
  const st = state.builders[section] ||= { idx: 0, order: [] };
  if (!Array.isArray(st.order)) { st.idx = 0; st.order = []; }
  const words = set[st.idx], order = st.order;
  const sh = seeded([...words.keys()], section * 7 + st.idx * 13 + 3);
  const full = order.length === words.length, right = full && order.every((v, i) => words[v] === words[i]);
  $("buildCount").textContent = `Sentence ${st.idx + 1} / ${set.length}`;
  $("builder").innerHTML = `<div class="answerline">${order.map(i => esc(words[i])).join(" ") || '<span class="small">Your sentence appears here…</span>'}</div>
    <div class="tiles">${sh.filter(i => !order.includes(i)).map(i => `<button class="tile" data-tile="${i}">${esc(words[i])}</button>`).join("")}</div>
    <div id="buildFeedback" class="feedback ${full ? (right ? "ok" : "bad") : ""}">${full ? (right ? "✓ Correct sentence! Well done." : "✕ The word order needs another try.") : ""}</div>
    <div class="btn-row"><button id="undo" class="soft small-btn">↶ Undo</button><button id="clearBuilder" class="soft small-btn">Reset</button>
    ${exam ? "" : '<button id="showBuilder" class="soft small-btn">👁 Show answer</button>'}<button id="sayBuilder" class="soft small-btn">🔊 Listen</button>
    <span style="flex:1"></span><button id="prevB" class="ghost small-btn" ${st.idx === 0 ? "disabled" : ""}>← Previous</button><button id="nextB" class="small-btn" ${st.idx === set.length - 1 ? "disabled" : ""}>Next sentence →</button></div>`;
  // compare by word text so duplicate words (e.g. two "I") don't cause false errors
  $("builder").querySelectorAll("[data-tile]").forEach(b => b.onclick = () => { order.push(+b.dataset.tile); save(); renderBuilder(); });
  $("undo").onclick = () => { order.pop(); save(); renderBuilder(); };
  $("clearBuilder").onclick = () => { st.order = []; save(); renderBuilder(); };
  if (!exam) $("showBuilder").onclick = () => { $("buildFeedback").className = "feedback"; $("buildFeedback").textContent = "Answer: " + words.join(" ").replace(/ ([.,?])/g, "$1"); };
  $("sayBuilder").onclick = () => speak(words.join(" "));
  $("prevB").onclick = () => { st.idx--; st.order = []; save(); renderBuilder(); };
  $("nextB").onclick = () => { st.idx++; st.order = []; save(); renderBuilder(); };
}

/* =========================================================
   MISSIONS (speaking + writing, with optional recording)
   ========================================================= */
let rec = null, chunks = [];
function renderMission() {
  const m = MISSIONS[section];
  $("missions").innerHTML = ["🎙 Speaking mission", "✍️ Writing mission"].map((type, i) => `
    <div class="mission"><h3>${type} · ${esc(m[0])}</h3><p>${esc(m[1])}</p>
    <p class="small">${i === 0 ? "Aim for 45–75 seconds. Plan in a few key words, then record yourself and listen back." : "Aim for 80–120 words."}</p>
    <textarea id="writing${i}" rows="4" placeholder="${i === 0 ? "Key words / plan…" : "Write your answer here…"}"></textarea>
    ${i === 0 ? `<div class="btn-row"><button class="soft small-btn" id="recBtn">⏺ Record</button><audio id="recAudio" controls style="display:none;height:36px"></audio><a id="recDl" style="display:none" class="small">⬇ Download recording</a></div>` : ""}
    ${exam ? "" : `<div class="btn-row"><button class="soft small-btn" data-model="${i}-1">B1 model</button><button class="soft small-btn" data-model="${i}-2">B2 model</button>
      <button class="ghost small-btn" data-msay="2">🔊 Listen B1</button><button class="ghost small-btn" data-msay="3">🔊 Listen B2</button></div>`}
    <div class="model" id="model${i}"></div></div>`).join("");
  [0, 1].forEach(i => { const el = $("writing" + i); el.value = state.writing[section + "-" + i] || ""; el.oninput = () => { state.writing[section + "-" + i] = el.value; save(); }; });
  $("missions").querySelectorAll("[data-model]").forEach(b => b.onclick = () => {
    const [i, lvl] = b.dataset.model.split("-"); const el = $("model" + i);
    el.innerHTML = `<div class="lvl">${lvl === "1" ? "B1 MODEL" : "B2 MODEL"}</div>${esc(m[+lvl + 1])}`; el.classList.add("visible");
  });
  $("missions").querySelectorAll("[data-msay]").forEach(b => b.onclick = () => speak(m[+b.dataset.msay]));
  const rb = $("recBtn");
  rb.onclick = async () => {
    if (rec && rec.state === "recording") { rec.stop(); return; }
    if (!navigator.mediaDevices || !window.MediaRecorder) { alert("Recording is not supported in this browser."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = []; rec = new MediaRecorder(stream);
      rec.ondataavailable = e => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" }), url = URL.createObjectURL(blob);
        const a = $("recAudio"), d = $("recDl"); if (!a) return;
        a.src = url; a.style.display = "inline-block"; d.href = url; d.download = "Antoine_speaking_" + (section + 1) + ".webm"; d.style.display = "inline";
        rb.textContent = "⏺ Record again";
      };
      rec.start(); rb.textContent = "⏹ Stop recording";
    } catch (e) { alert("Microphone access was refused or is unavailable."); }
  };
  $("moduleDone").textContent = state.done[section] ? "✓ Module completed — click to undo" : "✓ Mark this module as completed";
}

/* =========================================================
   RENDER
   ========================================================= */
function renderNav() {
  $("nav").innerHTML = MODULES.map((m, i) => `<button class="mod-btn ${i === section ? "active" : ""}" data-section="${i}">
    <span class="ic">${m.icon}</span><span class="n">MODULE ${String(i + 1).padStart(2, "0")}</span><span class="t">${esc(m.short)}</span>${state.done[i] ? '<span class="tick">✓</span>' : ""}</button>`).join("");
  document.querySelectorAll("[data-section]").forEach(b => b.onclick = () => { section = +b.dataset.section; state.section = section; save(); render(); $("nav").scrollIntoView({ behavior: "smooth" }); });
}
function showVocab() {
  const rows = VOCAB[$("vocab").value] || [];
  $("vocabList").innerHTML = rows.map(r => `<div class="vcard">${say(r[3])}<b>${esc(r[0])}</b><div class="fr">${esc(r[1])}</div><div class="def">${esc(r[2])}</div><i>${esc(r[3])}</i></div>`).join("");
}
function render() {
  clearTimers();
  document.body.classList.toggle("no-fr", !state.fr);
  renderNav();
  const m = MODULES[section];
  $("moduleKicker").textContent = `MODULE ${String(section + 1).padStart(2, "0")} OF 05`;
  $("sectionTitle").textContent = m.icon + " " + m.title;
  $("rule").textContent = m.goal;
  $("teaching").innerHTML = TEACH[section]();
  bindTeaching();
  const cats = Object.keys(VOCAB);
  $("vocab").innerHTML = cats.map(c => `<option value="${esc(c)}" ${c === VOCAB_DEFAULT[section] ? "selected" : ""}>${esc(c)}</option>`).join("");
  $("vocab").onchange = showVocab; showVocab();
  const qs = QUESTIONS.map((q, i) => ({ ...q, id: i })).filter(q => q.s === section);
  $("count").textContent = `${qs.length} questions`;
  $("questions").innerHTML = qs.map((q, n) => questionHtml(q, "q", n + 1)).join("");
  bindQuestions($("questions"));
  GAMES[section]($("game"));
  renderBuilder(); renderMission(); updateScore(); renderToolbar();
  speedRound();
}
function renderToolbar() {
  $("helpToggle").textContent = "🇫🇷 FR help: " + (state.fr ? "ON" : "OFF"); $("helpToggle").setAttribute("aria-pressed", state.fr);
  $("accentToggle").textContent = "🔊 Accent: " + (state.accent === "en-GB" ? "🇬🇧 UK" : "🇺🇸 US");
  $("modeToggle").textContent = exam ? "📝 Exam mode" : "🎓 Guided mode"; $("modeToggle").setAttribute("aria-pressed", exam);
}

/* Mixed challenge */
let mixedSet = [];
function launchMixed(reshuffle) {
  mixedOn = true;
  if (reshuffle || !mixedSet.length) {
    mixedSet = shuffle([...QUESTIONS.keys()]).slice(0, 15);
    mixedSet.forEach(i => { delete state.answers["mixed" + i]; delete optCache["mixed" + i]; }); save();
  }
  $("mixedArea").innerHTML = mixedSet.map((i, n) => questionHtml({ ...QUESTIONS[i], id: i }, "mixed", n + 1)).join("") +
    `<div class="btn-row"><button id="mixedScore" class="primary">Check my score</button><button id="mixedNew" class="ghost">↻ New set of 15</button><span id="mixedRes" class="small"></span></div>`;
  bindQuestions($("mixedArea"));
  $("mixedScore").onclick = () => {
    const a = mixedSet.map(i => state.answers["mixed" + i]).filter(Boolean), c = a.filter(x => x.correct).length;
    $("mixedRes").innerHTML = `<b style="color:var(--deep);font-size:17px">${c} / 15 correct</b> · ${a.length} answered${c >= 12 ? " · 🎉 Exam-ready!" : c >= 9 ? " · 👍 Good — review the red ones." : " · 💪 Revisit the modules, then try again."}`;
  };
  $("mixedNew").onclick = () => launchMixed(true);
}

/* Speed round */
function speedRound() {
  quickGame($("speed"), { title: "⏱ 60-second speed round", key: "speed", seconds: 60, group: "speed",
    items: QUESTIONS, desc: "Questions from all modules. Quick: one click per question!",
    before: it => `<div class="q-section" style="text-align:center">${esc(MODULES[it.s].short)}</div>`,
    prompt: it => esc(it.stem).replace("___", "<u>&nbsp;&nbsp;?&nbsp;&nbsp;</u>"), opts: it => shuffle(it.options), ans: it => it.answer,
    good: it => esc(it.hint), bad: it => "Answer: <b>" + esc(it.answer) + "</b> · " + esc(it.hint) });
}

/* =========================================================
   TOOLBAR, NOTES, FOOTER
   ========================================================= */
$("statQ").textContent = QUESTIONS.length;
$("helpToggle").onclick = () => { state.fr = !state.fr; save(); render(); if (mixedOn) launchMixed(); };
$("accentToggle").onclick = () => { state.accent = state.accent === "en-GB" ? "en-US" : "en-GB"; save(); renderToolbar(); speak(state.accent === "en-GB" ? "British accent selected." : "American accent selected."); };
$("modeToggle").onclick = () => { exam = !exam; render(); if (mixedOn) launchMixed(); };
$("reset").onclick = () => {
  if (!confirm("Clear all saved scores, drafts, notes and game records?")) return;
  localStorage.removeItem(KEY); load(); section = 0; mixedOn = false; mixedSet = []; Object.keys(optCache).forEach(k => delete optCache[k]);
  $("mixedArea").innerHTML = ""; $("notes").value = ""; $("url").value = ""; $("evalComment").value = ""; renderRating(); render();
};
$("print").onclick = () => window.print();
$("mixed").onclick = () => { launchMixed(true); $("mixedArea").scrollIntoView({ behavior: "smooth" }); };
$("moduleDone").onclick = () => { state.done[section] = !state.done[section]; save(); renderNav(); renderMission(); };

$("notes").value = state.notes || ""; $("notes").oninput = () => { state.notes = $("notes").value; save(); };
$("url").value = state.url || ""; $("url").oninput = () => { state.url = $("url").value; save(); };

function summaryText() {
  const lines = ["Antoine · VTEST Final Masterclass", "Date: " + new Date().toLocaleDateString("en-GB"), ""];
  MODULES.forEach((m, i) => {
    const a = QUESTIONS.map((q, k) => state.answers["q" + k] && q.s === i ? state.answers["q" + k] : null).filter(Boolean);
    lines.push(`${i + 1}. ${m.title}: ${a.filter(x => x.correct).length} / ${a.length} correct${state.done[i] ? " · completed" : ""}`);
  });
  const mx = mixedSet.map(i => state.answers["mixed" + i]).filter(Boolean);
  if (mx.length) lines.push(`Mixed challenge: ${mx.filter(x => x.correct).length} / 15`);
  const b = state.best; lines.push("", "Best game scores: " + Object.entries(b).map(([k, v]) => `${k} ${v}`).join(" · "));
  lines.push("", "Confidence rating: " + (state.evalRating ? state.evalRating + " / 5" : "—"), "Learner comment: " + (state.evalComment || "—"), "", "Trainer notes: " + (state.notes || "—"), "Lesson URL: " + (state.url || "—"));
  return lines.join("\n");
}
$("copySummary").onclick = async () => {
  const t = summaryText();
  try { await navigator.clipboard.writeText(t); $("copyMsg").textContent = "✓ Copied — paste it into your Google Doc or email."; }
  catch (e) { const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); $("copyMsg").textContent = "✓ Copied."; } catch (_) { $("copyMsg").textContent = "Copy not available — select the text manually."; } ta.remove(); }
};

function renderRating() {
  $("rating").innerHTML = [1, 2, 3, 4, 5].map(n => `<button role="radio" aria-checked="${state.evalRating === n}" class="${state.evalRating >= n ? "on" : ""}" data-r="${n}">${n}</button>`).join("");
  $("rating").querySelectorAll("[data-r]").forEach(b => b.onclick = () => { state.evalRating = +b.dataset.r; save(); renderRating(); $("evalSaved").textContent = "✓ Saved on this device."; });
}
renderRating();
$("evalComment").value = state.evalComment || "";
$("evalComment").oninput = () => { state.evalComment = $("evalComment").value; save(); $("evalSaved").textContent = "✓ Saved on this device."; };

document.addEventListener("click", e => { const b = e.target.closest("[data-say]"); if (b) speak(b.dataset.say); });

render();
})();
