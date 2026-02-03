(function(){
'use strict';
const $=id=>document.getElementById(id);
const qa=s=>Array.from(document.querySelectorAll(s));
let score=0, attempts=0;

function updateScore(){
  $('scoreNow').textContent=String(score);
  $('scoreMax').textContent=String(attempts);
  $('scoreNow2').textContent=String(score);
  $('scoreMax2').textContent=String(attempts);
}

function speak(text){
  try { speechSynthesis.cancel(); } catch(e){}
  const u=new SpeechSynthesisUtterance(text);
  const acc=$('accentSelect').value;
  u.lang = acc==='uk' ? 'en-GB' : 'en-US';
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

function shuffle(a){
  const b=a.slice();
  for(let i=b.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [b[i],b[j]]=[b[j],b[i]];
  }
  return b;
}

/* ---------------- Flashcards ---------------- */
function makeCard(frontText, backHTML, sayText){
  const card=document.createElement('div'); card.className='card';
  const inner=document.createElement('div'); inner.className='cardInner';
  const front=document.createElement('div'); front.className='face front'; front.textContent=frontText;
  const back=document.createElement('div'); back.className='face back'; back.innerHTML=backHTML;
  inner.appendChild(front); inner.appendChild(back);
  card.appendChild(inner);
  card.addEventListener('click', ()=>{
    card.classList.toggle('flip');
    if(sayText) speak(sayText);
  });
  return card;
}

function renderAlphabet(){
  const root=$('alphabetCards'); root.innerHTML='';
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letters.forEach(l=>{
    const name = (l==='Z' ? {us:'zee',uk:'zed'}[$('accentSelect').value] : l);
    const back = `<div class="ipa">${l}</div><div class="trap">Tap to hear the letter name.</div>`;
    root.appendChild(makeCard(l, back, name));
  });
}

const vocabItems=[
  {w:'think', ipa:'/θɪŋk/', trap:'TH /θ/ (air) — not “sink”'},
  {w:'thin', ipa:'/θɪn/', trap:'TH /θ/ — not “sin”'},
  {w:'three', ipa:'/θriː/', trap:'TH /θ/ — not “tree”'},
  {w:'this', ipa:'/ðɪs/', trap:'Voiced TH /ð/ — not “zis”'},
  {w:'those', ipa:'/ðəʊz/ (UK) /ðoʊz/ (US)', trap:'Voiced TH /ð/ — not “doze”'},
  {w:'beach', ipa:'/biːtʃ/', trap:'Long /iː/ — not “bitch”'},
  {w:'ship', ipa:'/ʃɪp/', trap:'Short /ɪ/ — not /iː/'},
  {w:'sheep', ipa:'/ʃiːp/', trap:'Long /iː/ — not /ɪ/'},
  {w:'friend', ipa:'/frend/', trap:'“ie” = /e/ here (not “free-end”)'},
  {w:'comfortable', ipa:'/ˈkʌmftəbəl/', trap:'Often reduced: “comf-tuh-bul”'},
  {w:'vegetable', ipa:'/ˈvedʒtəbəl/', trap:'3 syllables: “VEJ-tuh-bul”'},
  {w:'clothes', ipa:'/kloʊðz/ (US) /kləʊðz/ (UK)', trap:'Has /ðz/ at the end'},
  {w:'world', ipa:'/wɜːrld/ (US) /wɜːld/ (UK)', trap:'R + L cluster (world)'},
  {w:'would', ipa:'/wʊd/', trap:'Short /ʊ/ (not “wood” exactly, but close)'},
  {w:'sheet', ipa:'/ʃiːt/', trap:'Careful: not “shit” (/ʃɪt/)'},
  {w:'beach / bitch', ipa:'contrast', trap:'Train /iː/ vs /ɪ/'},
];

function renderVocab(){
  const root=$('vocabCards'); root.innerHTML='';
  vocabItems.forEach(it=>{
    const back = `<div class="ipa">${it.ipa}</div><div class="trap">${it.trap}</div><div class="hint">Tap to hear.</div>`;
    // for combined entries like "beach / bitch", only speak first part by default
    const say = it.w.includes('/') ? it.w.split('/')[0].trim() : it.w;
    root.appendChild(makeCard(it.w, back, say));
  });
}

/* ---------------- MCQ engine (multi attempts until correct) ---------------- */
function renderMCQ(root, item){
  root.innerHTML='';
  const p=document.createElement('p');
  p.innerHTML = item.prompt;
  root.appendChild(p);

  const actions=document.createElement('div'); actions.className='actions';
  const play=document.createElement('button'); play.textContent='▶ Listen';
  play.onclick=()=>speak(item.say);
  actions.appendChild(play);

  if(item.say2){
    const play2=document.createElement('button'); play2.textContent='▶ Listen again';
    play2.onclick=()=>speak(item.say2);
    actions.appendChild(play2);
  }
  root.appendChild(actions);

  const fb=document.createElement('div'); fb.className='feedback';
  const hint=document.createElement('div'); hint.className='hint';

  const opts = shuffle(item.options);
  opts.forEach(o=>{
    const b=document.createElement('button'); b.className='option'; b.textContent=o;
    b.addEventListener('click', ()=>{
      attempts++;
      if(o===item.answer){
        score++;
        fb.textContent='✅ Correct!';
        hint.textContent=item.explain || '';
        qa('#'+root.id+' .option').forEach(x=>x.classList.add('disabled'));
      }else{
        b.classList.add('disabled');
        fb.textContent='❌ Try again.';
        hint.textContent=item.hint || '';
      }
      updateScore();
    });
    root.appendChild(b);
  });
  root.appendChild(fb);
  root.appendChild(hint);
}

/* ---------------- Datasets (expanded) ---------------- */
const thItems=[
  {say:'think', prompt:'Which word did you hear?', options:['think','sink'], answer:'think', hint:'TH /θ/ = air (no voice).', explain:'Keep tongue between teeth lightly: /θ/.'},
  {say:'thin', prompt:'Which word did you hear?', options:['thin','sin'], answer:'thin', hint:'TH /θ/ ≠ S.', explain:'A tiny “h” breath sound.'},
  {say:'three', prompt:'Which word did you hear?', options:['three','tree'], answer:'three', hint:'TH /θ/ is not T.', explain:'Let air escape around tongue.'},
  {say:'thank', prompt:'Which word did you hear?', options:['thank','sank'], answer:'thank', hint:'Don’t replace TH with S.', explain:'Tongue forward.'},
  {say:'thumb', prompt:'Which word did you hear?', options:['thumb','sum'], answer:'thumb', hint:'TH is not S.', explain:'Short /ʌ/ in thumb.'},
  {say:'those', prompt:'Which word did you hear?', options:['those','doze'], answer:'those', hint:'Voiced TH /ð/ has vibration.', explain:'Touch throat: you should feel voice.'},
  {say:'this', prompt:'Which word did you hear?', options:['this','zis'], answer:'this', hint:'English has /ð/, French does not.', explain:'Not “zis”.'},
  {say:'they', prompt:'Which word did you hear?', options:['they','day'], answer:'they', hint:'Voiced TH /ð/ ≠ D.', explain:'Tongue between teeth.'},
  {say:'breathe', prompt:'Which word did you hear?', options:['breathe','breeze'], answer:'breathe', hint:'TH at the end can be /ð/.', explain:'breathe ends with /ð/.'},
  {say:'bath', prompt:'Which word did you hear?', options:['bath','bass'], answer:'bath', hint:'Final TH can be /θ/.', explain:'bath ends with /θ/.'},
];

const vowelItems=[
  {say:'ship', prompt:'Which word did you hear?', options:['ship','sheep'], answer:'ship', hint:'Short /ɪ/ (relaxed).', explain:'ship=/ʃɪp/, sheep=/ʃiːp/.'},
  {say:'sheep', prompt:'Which word did you hear?', options:['ship','sheep'], answer:'sheep', hint:'Long /iː/ (smile).', explain:'Hold the sound longer.'},
  {say:'bit', prompt:'Which word did you hear?', options:['bit','beat'], answer:'bit', hint:'/ɪ/ vs /iː/.', explain:'bit is short.'},
  {say:'beat', prompt:'Which word did you hear?', options:['bit','beat'], answer:'beat', hint:'Long /iː/.', explain:'Smile slightly.'},
  {say:'pull', prompt:'Which word did you hear?', options:['pull','pool'], answer:'pull', hint:'Short /ʊ/.', explain:'pull=/pʊl/.'},
  {say:'pool', prompt:'Which word did you hear?', options:['pull','pool'], answer:'pool', hint:'Long /uː/.', explain:'pool=/puːl/.'},
  {say:'cap', prompt:'Which word did you hear?', options:['cap','cup'], answer:'cap', hint:'/æ/ is wide (open mouth).', explain:'cap=/kæp/.'},
  {say:'cup', prompt:'Which word did you hear?', options:['cap','cup'], answer:'cup', hint:'/ʌ/ is central.', explain:'cup=/kʌp/.'},
  {say:'walk', prompt:'Which word did you hear?', options:['walk','work'], answer:'walk', hint:'/ɔː/ vs /ɜː/.', explain:'walk has /ɔː/.'},
  {say:'work', prompt:'Which word did you hear?', options:['walk','work'], answer:'work', hint:'R-colored vowel.', explain:'work=/wɜːrk/ (US).'}
];

const spellingItems=[
  {say:'see', prompt:'I want to ___ my friend tomorrow.', options:['see','sea'], answer:'see', hint:'Meaning: verb (look).', explain:'see = verb'},
  {say:'sea', prompt:'The ___ is calm today.', options:['see','sea'], answer:'sea', hint:'Meaning: ocean.', explain:'sea = noun'},
  {say:'hear', prompt:'Can you ___ the music?', options:['hear','here'], answer:'hear', hint:'Meaning: listen.', explain:'hear = listen'},
  {say:'here', prompt:'Come ___, please.', options:['hear','here'], answer:'here', hint:'Meaning: this place.', explain:'here = place'},
  {say:'their', prompt:'This is ___ house.', options:['their','there',"they're"], answer:'their', hint:'Possessive (my/your/their).', explain:'their = possessive'},
  {say:'there', prompt:'Put it over ___.', options:['their','there',"they're"], answer:'there', hint:'Place (here/there).', explain:'there = place'},
  {say:"they're", prompt:'___ happy today.', options:['their','there',"they're"], answer:"they're", hint:'they are = contraction.', explain:"they're = they are"},
  {say:'meet', prompt:'Nice to ___ you.', options:['meet','meat'], answer:'meet', hint:'Verb: 만나/rencontrer.', explain:'meet = verb'},
  {say:'meat', prompt:'I don’t eat much ___.', options:['meet','meat'], answer:'meat', hint:'Food.', explain:'meat = food'},
  {say:'right', prompt:'Turn ___ at the corner.', options:['right','write'], answer:'right', hint:'Direction.', explain:'right = direction'},
  {say:'write', prompt:'Please ___ your name.', options:['right','write'], answer:'write', hint:'Verb: to write.', explain:'write = verb'},
  {say:'peace', prompt:'We want ___ and quiet.', options:['peace','piece'], answer:'peace', hint:'Not a piece of cake.', explain:'peace = calm'},
  {say:'piece', prompt:'Can I have a ___ of cake?', options:['peace','piece'], answer:'piece', hint:'A part of something.', explain:'piece = part'},
];

const dictationItems = [
  // words
  {type:'word', text:'think', note:'TH /θ/'},
  {type:'word', text:'those', note:'TH /ð/'},
  {type:'word', text:'ship', note:'/ɪ/'},
  {type:'word', text:'sheep', note:'/iː/'},
  {type:'word', text:'friend', note:'ie → /e/'},
  {type:'word', text:'comfortable', note:'reduced syllables'},
  {type:'word', text:'world', note:'R+L'},
  {type:'word', text:'clothes', note:'/ðz/'},
  {type:'word', text:'work', note:'/ɜː/'},
  {type:'word', text:'walk', note:'/ɔː/'},
  // phrases
  {type:'phrase', text:'three things', note:'TH + consonant cluster'},
  {type:'phrase', text:'this week', note:'voiced TH'},
  {type:'phrase', text:'a piece of cake', note:'piece not peace'},
  {type:'phrase', text:'turn right', note:'right vs write'},
  {type:'phrase', text:'over there', note:'there (place)'},
  {type:'phrase', text:'their house', note:'their (possessive)'},
  {type:'phrase', text:'sheep in the field', note:'/iː/'},
  {type:'phrase', text:'ship in the harbor', note:'/ɪ/'},
  // sentences
  {type:'sentence', text:'I think those three things are important.', note:'TH voiced/unvoiced'},
  {type:'sentence', text:'Can you hear me here?', note:'hear/here'},
  {type:'sentence', text:"They're going to meet their friends there.", note:"they're/their/there"},
  {type:'sentence', text:'Please write it on the right page.', note:'write/right'},
  {type:'sentence', text:'She put a piece of meat on the table.', note:'piece/meat'},
  {type:'sentence', text:'The sheep is on the beach.', note:'/iː/'},
  {type:'sentence', text:'The ship is in the harbor.', note:'/ɪ/'},
];

const builderSentences=[
  {say:'The third floor is through the hall.', words:['The','third','floor','is','through','the','hall.']},
  {say:'I thought they were there.', words:['I','thought','they','were','there.']},
  {say:'Please turn right at the corner.', words:['Please','turn','right','at','the','corner.']},
  {say:'Can you hear me here?', words:['Can','you','hear','me','here?']},
  {say:"They're going to meet their friends there.", words:["They're",'going','to','meet','their','friends','there.']},
  {say:'The sheep is on the beach.', words:['The','sheep','is','on','the','beach.']},
  {say:'This is a comfortable chair.', words:['This','is','a','comfortable','chair.']},
  {say:'Those clothes are expensive.', words:['Those','clothes','are','expensive.']},
];

/* ---------------- Section state ---------------- */
let thIndex=0, vowelIndex=0, spellIndex=0, dictIndex=0, builderIndex=0;

function drawTH(){ renderMCQ($('thQuiz'), thItems[thIndex]); }
function drawVowels(){ renderMCQ($('vowelQuiz'), vowelItems[vowelIndex]); }
function drawSpelling(){ renderMCQ($('spellingQuiz'), spellingItems[spellIndex]); }

function drawDictation(){
  const root=$('dictation'); root.innerHTML='';
  const item=dictationItems[dictIndex];
  const title=document.createElement('p');
  title.innerHTML = `Type what you hear <span class="pill">${item.type}</span>`;
  root.appendChild(title);

  const actions=document.createElement('div'); actions.className='actions';
  const play=document.createElement('button'); play.textContent='▶ Listen';
  play.onclick=()=>speak(item.text);
  actions.appendChild(play);
  root.appendChild(actions);

  const inp=document.createElement('input'); inp.type='text'; inp.placeholder='Type here…';
  root.appendChild(inp);

  const fb=document.createElement('div'); fb.className='feedback';
  const hint=document.createElement('div'); hint.className='hint';
  hint.textContent = item.note ? ('Tip: '+item.note) : '';
  root.appendChild(fb); root.appendChild(hint);

  const checkRow=document.createElement('div'); checkRow.className='actions';
  const check=document.createElement('button'); check.textContent='Check';
  const reveal=document.createElement('button'); reveal.textContent='Show answer';
  check.onclick=()=>{
    attempts++;
    const got=inp.value.trim().toLowerCase();
    const ans=item.text.trim().toLowerCase();
    if(got===ans){
      score++;
      fb.textContent='✅ Correct!';
      inp.disabled=true;
    }else{
      fb.textContent='❌ Not quite. Try again.';
    }
    updateScore();
  };
  reveal.onclick=()=>{ fb.textContent='Answer: '+item.text; };
  checkRow.appendChild(check); checkRow.appendChild(reveal);
  root.appendChild(checkRow);
}

function drawBuilder(){
  const root=$('sentenceBuilder'); root.innerHTML='';
  const item=builderSentences[builderIndex];

  const p=document.createElement('p');
  p.textContent='Tap words to build the sentence. Then check + listen.';
  root.appendChild(p);

  const bank=document.createElement('div'); bank.className='bank';
  const slots=document.createElement('div'); slots.className='slots';

  // Create slots
  for(let i=0;i<item.words.length;i++){
    const s=document.createElement('span'); s.className='slot';
    slots.appendChild(s);
  }

  // Create shuffled chips
  const shuffled=shuffle(item.words);
  shuffled.forEach(w=>{
    const c=document.createElement('span'); c.className='chip'; c.textContent=w;
    c.addEventListener('click', ()=>{
      // place in first empty slot
      const empty=Array.from(slots.children).find(el=>el.textContent==='');
      if(empty){ empty.textContent=w; c.remove(); }
    });
    bank.appendChild(c);
  });

  root.appendChild(bank);
  root.appendChild(slots);

  const fb=document.createElement('div'); fb.className='feedback';
  const hint=document.createElement('div'); hint.className='hint';
  root.appendChild(fb); root.appendChild(hint);

  const actions=document.createElement('div'); actions.className='actions';
  const check=document.createElement('button'); check.textContent='Check order';
  const listen=document.createElement('button'); listen.textContent='▶ Listen';
  const reset=document.createElement('button'); reset.textContent='Reset sentence';

  function currentSentence(){
    return Array.from(slots.children).map(s=>s.textContent).join(' ').replace(/\s+/g,' ').trim();
  }
  function targetSentence(){
    return item.words.join(' ').replace(/\s+/g,' ').trim();
  }

  check.onclick=()=>{
    attempts++;
    const got=currentSentence();
    const target=targetSentence();
    if(got===target){
      score++;
      fb.textContent='✅ Correct!';
      hint.textContent='Now listen and repeat (focus on rhythm).';
    }else{
      fb.textContent='❌ Not yet.';
      hint.textContent='Tip: start with the subject. Watch word order.';
    }
    updateScore();
  };
  listen.onclick=()=>speak(item.say);
  reset.onclick=()=>drawBuilder();

  actions.appendChild(check);
  actions.appendChild(listen);
  actions.appendChild(reset);
  root.appendChild(actions);
}

/* ---------------- Print (grammar only) ---------------- */
function printNode(node){
  const w=window.open('','_blank');
  if(!w) return;
  w.document.open();
  w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Print</title></head><body>');
  w.document.write(node.innerHTML);
  w.document.write('</body></html>');
  w.document.close();
  w.focus();
  w.print();
}

/* ---------------- Bindings ---------------- */
function bind(){
  // print
  qa('.printBtn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id=b.getAttribute('data-print');
      const el=$(id);
      if(el) printNode(el);
    });
  });

  // next buttons
  $('thNext').addEventListener('click', ()=>{ thIndex=(thIndex+1)%thItems.length; drawTH(); });
  $('vowelNext').addEventListener('click', ()=>{ vowelIndex=(vowelIndex+1)%vowelItems.length; drawVowels(); });
  $('spellNext').addEventListener('click', ()=>{ spellIndex=(spellIndex+1)%spellingItems.length; drawSpelling(); });
  $('dictNext').addEventListener('click', ()=>{ dictIndex=(dictIndex+1)%dictationItems.length; drawDictation(); });
  $('builderNext').addEventListener('click', ()=>{ builderIndex=(builderIndex+1)%builderSentences.length; drawBuilder(); });

  // reset all
  $('resetAll').addEventListener('click', ()=>{
    score=0; attempts=0;
    thIndex=0; vowelIndex=0; spellIndex=0; dictIndex=0; builderIndex=0;
    renderAlphabet(); renderVocab();
    drawTH(); drawVowels(); drawSpelling(); drawDictation(); drawBuilder();
    updateScore();
  });

  // per-section resets
  qa('[data-reset]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key=btn.getAttribute('data-reset');
      if(key==='alphabet'){ renderAlphabet(); }
      if(key==='th'){ thIndex=0; drawTH(); }
      if(key==='vowels'){ vowelIndex=0; drawVowels(); }
      if(key==='spelling'){ spellIndex=0; drawSpelling(); }
      if(key==='dictation'){ dictIndex=0; drawDictation(); }
      if(key==='builder'){ builderIndex=0; drawBuilder(); }
      if(key==='vocab'){ renderVocab(); }
    });
  });

  // accent change: rerender alphabet so Z speaks zed/zee correctly
  $('accentSelect').addEventListener('change', ()=>{
    renderAlphabet();
  });
}

/* ---------------- Init ---------------- */
function init(){
  renderAlphabet();
  renderVocab();
  drawTH();
  drawVowels();
  drawSpelling();
  drawDictation();
  drawBuilder();
  updateScore();
  bind();
}

init();
})();