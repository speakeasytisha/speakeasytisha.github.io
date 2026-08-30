function initHints(){
  document.querySelectorAll('.hint').forEach(btn=>{
    btn.addEventListener('click',()=>{
      let box = btn.parentElement.parentElement.querySelector('.hint-box');
      if(!box){ box = document.createElement('div'); box.className='hint-box'; btn.parentElement.parentElement.insertBefore(box, btn.parentElement.nextSibling); }
      box.textContent = btn.dataset.hint;
      box.hidden = !box.hidden;
    });
  });
}

function initAudio(){
  document.querySelectorAll('.listen').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const text = btn.dataset.speak || '';
      if(!('speechSynthesis' in window)){ alert('Speech synthesis is not available in this browser.'); return; }
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-GB'; utter.rate = .92;
      speechSynthesis.speak(utter);
    });
  });
}

function initFrench(){
  const btn = document.getElementById('toggleFrench');
  btn?.addEventListener('click',()=>{
    document.body.classList.toggle('show-fr');
    btn.textContent = document.body.classList.contains('show-fr') ? 'French help: on' : 'French help: off';
  });
}

function initTabs(){
  document.querySelectorAll('.tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.model-panel').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`model-${tab.dataset.tab}`)?.classList.add('active');
    });
  });
}

function initTranscripts(){
  document.querySelectorAll('.toggle-transcript').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const p = btn.parentElement.querySelector('.transcript');
      p.classList.toggle('hidden');
      btn.textContent = p.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    });
  });
}

function initPrint(){
  document.getElementById('printPage')?.addEventListener('click', ()=> window.print());
}

function initBackToTop(){
  const b=document.getElementById('backToTop');
  if(!b) return;
  window.addEventListener('scroll',()=>b.classList.toggle('show', window.scrollY>600));
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

initHints(); initAudio(); initFrench(); initTabs(); initTranscripts(); initPrint(); initBackToTop();
