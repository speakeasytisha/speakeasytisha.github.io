const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
let voices = [];

function refreshVoices(){
  if(!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices();
}

function chosenVoice(lang){
  refreshVoices();
  const exact = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  const english = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  return exact || english || null;
}

function speakText(text, style = 'clear'){
  if(!('speechSynthesis' in window)){
    alert('Audio is not available in this browser.');
    return;
  }
  const lang = $('#accentSelect')?.value || 'en-GB';
  const settings = {
    calm: { rate: .82, pitch: .88, volume: 1 },
    clear: { rate: .9, pitch: 1, volume: 1 },
    energetic: { rate: 1.03, pitch: 1.06, volume: 1 },
    firm: { rate: .86, pitch: .9, volume: 1 }
  }[style] || { rate: .9, pitch: 1, volume: 1 };
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.voice = chosenVoice(lang);
  u.rate = settings.rate;
  u.pitch = settings.pitch;
  u.volume = settings.volume;
  speechSynthesis.speak(u);
}

function alignmentText(){
  const context = $('#contextAccuracy')?.value || '';
  const oralFocus = $('#oralFocus')?.value || '';
  const priority = $('#prioritySelect')?.value || '';
  const cloe = $('#cloeBalance')?.value || '';
  const comments = ($('#comments')?.value || '').trim() || 'No additional comments.';
  return `Pre-Flight Briefing — Training Programme Confirmation\n\nProfessional context accuracy: ${context}\nOral communication focus: ${oralFocus}\nMost useful first priority: ${priority}\nCLOE preparation balance: ${cloe}\n\nComments / corrections / additional priorities:\n${comments}`;
}

function updateAlignmentOutput(){
  const output = $('#alignmentOutput');
  if(output) output.textContent = alignmentText();
}

function downloadText(filename, text){
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1200);
}

function saveState(){
  const state = {
    contextAccuracy: $('#contextAccuracy')?.value || '',
    oralFocus: $('#oralFocus')?.value || '',
    prioritySelect: $('#prioritySelect')?.value || '',
    cloeBalance: $('#cloeBalance')?.value || '',
    comments: $('#comments')?.value || '',
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('eden_preflight_alignment', JSON.stringify(state));
  updateAlignmentOutput();
  alert('Saved in this browser.');
}

function loadState(){
  try{
    const raw = localStorage.getItem('eden_preflight_alignment');
    if(!raw) return;
    const state = JSON.parse(raw);
    ['contextAccuracy','oralFocus','prioritySelect','cloeBalance','comments'].forEach(id => {
      if(state[id] !== undefined && $('#'+id)) $('#'+id).value = state[id];
    });
  }catch(err){
    console.warn('Could not load saved alignment', err);
  }
}

function init(){
  if('speechSynthesis' in window){
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }
  $$('[data-scroll]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.scroll);
      if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  $$('.speak').forEach(button => {
    button.addEventListener('click', () => speakText(button.dataset.text || '', button.dataset.style || 'clear'));
  });
  $('#stopAudio')?.addEventListener('click', () => {
    if('speechSynthesis' in window) speechSynthesis.cancel();
  });
  ['contextAccuracy','oralFocus','prioritySelect','cloeBalance','comments'].forEach(id => {
    $('#'+id)?.addEventListener('input', updateAlignmentOutput);
    $('#'+id)?.addEventListener('change', updateAlignmentOutput);
  });
  $('#copyAlignment')?.addEventListener('click', async () => {
    updateAlignmentOutput();
    const text = alignmentText();
    try{
      await navigator.clipboard.writeText(text);
      alert('Summary copied.');
    }catch(err){
      alert('Copy failed. You can select and copy the summary manually.');
    }
  });
  $('#downloadAlignment')?.addEventListener('click', () => downloadText('Eden-Cohen-Pre-Flight-Briefing-Confirmation.txt', alignmentText()));
  $('#saveAlignment')?.addEventListener('click', saveState);
  $('#printPage')?.addEventListener('click', () => window.print());
  loadState();
  updateAlignmentOutput();
}

document.addEventListener('DOMContentLoaded', init);
