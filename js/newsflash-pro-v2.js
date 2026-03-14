document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.story').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.story;
    document.getElementById(id).classList.add('active');
  });
});

document.getElementById('checkHeadlineMatch').addEventListener('click', ()=>{
  const selects = document.querySelectorAll('#headline .match-item select');
  const expected = ['space','history','wildlife'];
  let score = 0;
  selects.forEach((s,i)=>{ if(s.value === expected[i]) score++; });
  const fb = document.getElementById('headlineFeedback');
  if(score === expected.length){
    fb.textContent = 'Excellent — you matched all the headlines correctly.';
    fb.className = 'feedback ok';
  } else {
    fb.textContent = `You got ${score}/${expected.length}. Read the key idea again and try once more.`;
    fb.className = 'feedback nope';
  }
});

document.querySelectorAll('.check-mcq').forEach(button=>{
  button.addEventListener('click', ()=>{
    const box = button.closest('.mcq');
    const answer = box.dataset.answer;
    const chosen = box.querySelector('input[type="radio"]:checked');
    const fb = box.querySelector('.feedback');
    if(!chosen){
      fb.textContent = 'Choose an answer first.';
      fb.className = 'feedback nope';
      return;
    }
    if(chosen.value === answer){
      fb.textContent = 'Correct!';
      fb.className = 'feedback ok';
    } else {
      fb.textContent = 'Not quite. Look again at the time expression and the grammar clue.';
      fb.className = 'feedback nope';
    }
  });
});

document.querySelectorAll('.check-gap').forEach(button=>{
  button.addEventListener('click', ()=>{
    const box = button.closest('.gap');
    const answer = box.dataset.answer.trim().toLowerCase();
    const input = box.querySelector('input');
    const fb = box.querySelector('.feedback');
    const value = input.value.trim().toLowerCase().replace(/\s+/g,' ');
    if(!value){
      fb.textContent = 'Type your answer first.';
      fb.className = 'feedback nope';
      return;
    }
    if(value === answer){
      fb.textContent = 'Correct!';
      fb.className = 'feedback ok';
    } else {
      fb.textContent = 'Almost. Check the verb form carefully.';
      fb.className = 'feedback nope';
    }
  });
});

const out = document.getElementById('builderOutput');
document.getElementById('buildBtn').addEventListener('click', ()=>{
  const intro = document.getElementById('bConnect').value;
  const story = document.getElementById('bStory').value;
  const reason = document.getElementById('bReason').value;
  const next = document.getElementById('bNext').value;
  out.textContent = `${intro} ${story}. It matters because ${reason}. ${next}`;
});

document.getElementById('copyBtn').addEventListener('click', async ()=>{
  const text = out.textContent.trim();
  if(!text){
    out.textContent = 'Build your mini article first.';
    return;
  }
  try{ await navigator.clipboard.writeText(text); }catch(e){}
});

document.getElementById('speakBtn').addEventListener('click', ()=>{
  const text = out.textContent.trim();
  if(!text){
    out.textContent = 'Build your mini article first.';
    return;
  }
  if('speechSynthesis' in window){
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }
});
