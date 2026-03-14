function setFb(el, ok, msg){
  el.textContent = msg;
  el.className = 'feedback ' + (ok ? 'good' : 'bad');
}

document.querySelectorAll('.checkMini').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const q = document.querySelector(`input[name="${btn.dataset.q}"]:checked`);
    const fb = btn.parentElement.querySelector('.feedback');
    if(!q) return setFb(fb,false,'Choose an answer first.');
    setFb(fb, q.value===btn.dataset.a, q.value===btn.dataset.a ? 'Correct!' : 'Try again: use the present simple for routine.');
  });
});

document.querySelectorAll('.dialogue-select').forEach(sel=>{
  sel.addEventListener('change',()=>{
    const fb = sel.parentElement.querySelector('.feedback');
    setFb(fb, sel.value===sel.dataset.answer, sel.value===sel.dataset.answer ? 'Good answer.' : 'Not quite. Choose the clear, grammatical sentence.');
  });
});

document.querySelectorAll('.checkFill').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const box = btn.parentElement;
    const input = box.querySelector('input');
    const fb = box.querySelector('.feedback');
    const ok = input.value.trim().toLowerCase() === box.dataset.answer.toLowerCase();
    setFb(fb, ok, ok ? 'Correct!' : `Try again. Answer: ${box.dataset.answer}`);
  });
});

document.getElementById('checkGrammar').addEventListener('click',()=>{
  const items = [...document.querySelectorAll('.grammar-match')];
  const good = items.filter(i=>i.value===i.dataset.answer).length;
  setFb(document.getElementById('grammarFeedback'), good===items.length, `${good} / ${items.length} correct`);
});

document.getElementById('buildAnimal').addEventListener('click',()=>{
  const text = `I am a former ${document.getElementById('pastJob').value}. Now I ${document.getElementById('currentRole').value}. In this role, I ${document.getElementById('tasks').value}. I do this ${document.getElementById('reason').value}.`;
  document.getElementById('animalOutput').textContent = text;
});

document.getElementById('copyAnimal').addEventListener('click', async ()=>{
  const out = document.getElementById('animalOutput').textContent.trim();
  if(!out) return;
  try{ await navigator.clipboard.writeText(out); }catch(e){}
});

document.getElementById('resetAll').addEventListener('click',()=>location.reload());
