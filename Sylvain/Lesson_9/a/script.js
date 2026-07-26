const root = document.body;
const toggleFr = document.getElementById('toggleFr');
const resetAll = document.getElementById('resetAll');

function shuffleChildren(parent){
  const children = Array.from(parent.children);
  for(let i=children.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    parent.appendChild(children[j]);
    children.splice(j,1);
  }
}

document.querySelectorAll('.options').forEach(shuffleChildren);

toggleFr?.addEventListener('click',()=>{
  root.classList.toggle('show-fr');
  toggleFr.textContent = root.classList.contains('show-fr') ? 'Hide French help' : 'Show French help';
});

resetAll?.addEventListener('click',()=>{
  document.querySelectorAll('.correct,.wrong').forEach(el=>el.classList.remove('correct','wrong'));
  document.querySelectorAll('.feedback').forEach(el=>el.remove());
  document.querySelectorAll('input, textarea').forEach(el=>{ if(!el.readOnly && el.type !== 'date') el.value=''; el.classList.remove('ok','no'); });
  document.querySelectorAll('.hint-text,.model').forEach(el=>el.classList.remove('visible'));
  document.querySelectorAll('.options').forEach(shuffleChildren);
  window.scrollTo({top:0,behavior:'smooth'});
});

document.querySelectorAll('[data-speak]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(!('speechSynthesis' in window)) return alert('Speech synthesis is not available in this browser.');
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(btn.getAttribute('data-speak'));
    utter.lang = 'en-GB';
    utter.rate = .88;
    window.speechSynthesis.speak(utter);
  });
});

document.querySelectorAll('.hint').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const hint = btn.nextElementSibling;
    if(hint) hint.classList.toggle('visible');
  });
});

document.querySelectorAll('.mcq .options button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const mcq = btn.closest('.mcq');
    const answer = (mcq.dataset.answer || '').trim().toLowerCase();
    mcq.querySelectorAll('button').forEach(b=>b.classList.remove('correct','wrong'));
    mcq.querySelector('.feedback')?.remove();
    const chosen = btn.textContent.trim().toLowerCase();
    const fb = document.createElement('div');
    fb.className='feedback';
    if(chosen === answer){
      btn.classList.add('correct');
      fb.textContent='✅ Correct';
      fb.style.color='#166534';
    }else{
      btn.classList.add('wrong');
      fb.textContent=`❌ Try again. Correct answer: ${mcq.dataset.answer}`;
      fb.style.color='#991b1b';
    }
    mcq.appendChild(fb);
  });
});

function clean(str){return str.toLowerCase().trim().replace(/[’']/g,"'").replace(/[?.!]/g,'').replace(/\s+/g,' ')}

document.querySelectorAll('.check-writes').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const block = btn.closest('.exercise-block');
    block.querySelectorAll('.write').forEach(item=>{
      const input = item.querySelector('input');
      const answers = (item.dataset.answer || '').split('|').map(clean);
      const val = clean(input.value);
      input.classList.remove('ok','no');
      input.classList.add(answers.includes(val)?'ok':'no');
    });
  });
});

document.querySelectorAll('.check-paragraph').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const block = btn.closest('.exercise-block');
    block.querySelectorAll('.paragraph-fill input').forEach(input=>{
      const answers = (input.dataset.answer || '').split('|').map(clean);
      const val = clean(input.value);
      input.classList.remove('ok','no');
      input.classList.add(answers.includes(val)?'ok':'no');
    });
  });
});

document.querySelectorAll('.model-toggle').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const model = btn.parentElement.querySelector('.model');
    if(model){
      model.classList.toggle('visible');
      btn.textContent = model.classList.contains('visible') ? 'Hide model' : 'Show model';
    }
  });
});

document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.model-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.level)?.classList.add('active');
  });
});

const copyWriting = document.getElementById('copyWriting');
copyWriting?.addEventListener('click',async()=>{
  const text = document.getElementById('writingText').value;
  if(!text.trim()) return alert('Write your text first.');
  await navigator.clipboard.writeText(text);
  copyWriting.textContent='Copied!';
  setTimeout(()=>copyWriting.textContent='Copy text',1400);
});

function buildEval(){
  const name = document.getElementById('evalName')?.value || '';
  const date = document.getElementById('evalDate')?.value || '';
  const checked = Array.from(document.querySelectorAll('.evalItem:checked')).map(i=>`- ${i.value}`).join('\n');
  const useful = document.getElementById('evalUseful')?.value || '';
  const more = document.getElementById('evalMore')?.value || '';
  return `Évaluation de la séance — Present Perfect Foundations\nDate: ${date}\nNom: ${name}\n\nObjectifs validés:\n${checked || '- Aucun objectif coché'}\n\nCe qui a été utile aujourd'hui:\n${useful}\n\nÀ pratiquer davantage:\n${more}`;
}

document.getElementById('copyEval')?.addEventListener('click',async()=>{
  const text = buildEval();
  document.getElementById('evalOutput').value = text;
  await navigator.clipboard.writeText(text);
  document.getElementById('copyEval').textContent='Copied!';
  setTimeout(()=>document.getElementById('copyEval').textContent='Copy evaluation',1400);
});

document.getElementById('downloadEval')?.addEventListener('click',()=>{
  const blob = new Blob([buildEval()],{type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download='present-perfect-evaluation.txt';
  a.click();
  URL.revokeObjectURL(url);
});
