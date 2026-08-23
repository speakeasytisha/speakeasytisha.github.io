
(() => {
  const data = window.MYRIAM_SUCCESS_DATA;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  let activeMilestone = 0;
  let timelineTimer = null;

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function speak(text){
    if(!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 0.92;
    speechSynthesis.speak(u);
  }

  function renderScoreBars(){
    $('#scoreBars').innerHTML = data.final.scores.map(s => `
      <article class="score-row">
        <div class="score-head">
          <span>${escapeHtml(s.skill)}</span>
          <span>${s.score}% <small>(${escapeHtml(s.level)})</small></span>
        </div>
        <div class="score-meter"><div data-width="${s.score}"></div></div>
        <p>${escapeHtml(s.note)}</p>
      </article>
    `).join('');
    requestAnimationFrame(() => {
      $$('.score-meter div').forEach(el => el.style.width = `${el.dataset.width}%`);
    });
  }

  function renderTimeline(){
    $('#timeline').innerHTML = data.milestones.map((m, i) => `
      <button class="milestone ${i === activeMilestone ? 'active' : ''}" type="button" data-milestone="${i}">
        <div class="phase">${escapeHtml(m.phase)}</div>
        <h3>${escapeHtml(m.title)}</h3>
        <p>${escapeHtml(m.period)}</p>
      </button>
    `).join('');
    $$('[data-milestone]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeMilestone = Number(btn.dataset.milestone);
        renderTimeline();
        renderMilestoneDetails();
      });
    });
  }

  function renderMilestoneDetails(){
    const m = data.milestones[activeMilestone];
    $('#milestoneDetails').innerHTML = `
      <p class="kicker">Milestone ${escapeHtml(m.phase)}</p>
      <h3>${escapeHtml(m.title)}</h3>
      <p>${escapeHtml(m.summary)}</p>
      <div class="skill-tags">${m.skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join('')}</div>
      <div class="link-tags">${m.links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`).join('')}</div>
    `;
  }

  function playTimeline(){
    clearInterval(timelineTimer);
    activeMilestone = 0;
    renderTimeline();
    renderMilestoneDetails();
    timelineTimer = setInterval(() => {
      activeMilestone += 1;
      if(activeMilestone >= data.milestones.length){
        clearInterval(timelineTimer);
        celebrate();
        return;
      }
      renderTimeline();
      renderMilestoneDetails();
    }, 1900);
  }

  function renderProofCards(){
    $('#proofCards').innerHTML = data.proofPoints.map(p => `
      <article>
        <div class="before-t"><strong>Before</strong>${escapeHtml(p.before)}</div>
        <div class="after-t"><strong>Now</strong>${escapeHtml(p.after)}</div>
        <p><strong>${escapeHtml(p.message)}</strong></p>
      </article>
    `).join('');
  }

  function renderGallery(filter='all'){
    const items = data.lessonGallery.filter(item => {
      if(filter === 'all') return true;
      const hay = `${item.title} ${item.type} ${item.skill}`.toLowerCase();
      const key = filter.toLowerCase();
      if(key === 'exam') return hay.includes('exam') || hay.includes('mock') || hay.includes('strategy') || hay.includes('timer');
      return hay.includes(key);
    });
    $('#lessonGallery').innerHTML = items.map(item => `
      <article class="lesson-card">
        <span class="type">${escapeHtml(item.type)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p><strong>${escapeHtml(item.skill)}</strong></p>
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Open lesson →</a>
      </article>
    `).join('');
  }

  function celebrate(){
    const colors = ['#8f3b4c','#c46a7a','#d1a24a','#486b4f','#5c89a8','#f0d1a3'];
    for(let i=0;i<90;i++){
      const piece = document.createElement('div');
      piece.className = 'confetti';
      piece.style.left = Math.random()*100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random()*colors.length)];
      piece.style.animationDuration = (2.2 + Math.random()*2.6) + 's';
      piece.style.transform = `rotate(${Math.random()*360}deg)`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5200);
    }
  }

  function copyText(textareaId, text){
    const el = $(textareaId);
    el.value = text;
    if(navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{});
  }

  function getLetterText(){ return $('#teacherLetter').innerText.trim(); }

  function copyReflection(){
    const proud = $('#proudText').value.trim() || 'I am proud because I made real progress.';
    const strategy = $('#strategyText').value.trim() || 'The strategy that helped me was to stay calm and answer step by step.';
    const goal = $('#goalText').value.trim() || 'My next goal is to keep speaking and writing regularly.';
    const text = [
      'My English success card','',proud,strategy,goal,'',
      'I started at A2.1+ and reached B1++. I can be proud of myself.'
    ].join('\n');
    copyText('#reflectionOutput', text);
  }

  function bind(){
    $('#confettiBtn').addEventListener('click', celebrate);
    $('#printBtn').addEventListener('click', () => window.print());
    $('#openCertificate').addEventListener('click', () => $('#certificateModal').classList.remove('hidden'));
    $('#closeModal').addEventListener('click', () => $('#certificateModal').classList.add('hidden'));
    $('#certificateModal').addEventListener('click', (e) => {
      if(e.target.id === 'certificateModal') $('#certificateModal').classList.add('hidden');
    });
    $('#playTimeline').addEventListener('click', playTimeline);
    $('#galleryFilter').addEventListener('change', e => renderGallery(e.target.value));
    $('#copyLetter').addEventListener('click', () => navigator.clipboard.writeText(getLetterText()).catch(()=>{}));
    $('#listenLetter').addEventListener('click', () => speak(getLetterText()));
    $('#voiceBtn').addEventListener('click', () => speak("Myriam, you did it. Your progress is real, visible and deserved. I am very proud of you."));
    $('#copyReflection').addEventListener('click', copyReflection);
  }

  function init(){
    renderScoreBars();
    renderTimeline();
    renderMilestoneDetails();
    renderProofCards();
    renderGallery();
    bind();
    setTimeout(celebrate, 700);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
