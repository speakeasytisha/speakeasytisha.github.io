(() => {
  'use strict';
  const STORAGE_KEY = 'yanisLilateProgressV1';
  const skillOrder = [
    { name: 'Listening', type: 'Auto-marked' },
    { name: 'Reading', type: 'Auto-marked' },
    { name: 'Service language', type: 'Auto-marked' },
    { name: 'Conversation', type: 'Self-review' },
    { name: 'Writing', type: 'Self-review' },
    { name: 'Role-play', type: 'Self-review' },
    { name: 'Language accuracy', type: 'Lesson score' },
    { name: 'Vocabulary', type: 'Lesson score' }
  ];
  const $ = (s) => document.querySelector(s);
  function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
  function save(entries) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
  function safeText(text) { return String(text || '').replace(/[<>]/g, ''); }
  function dateDisplay(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function percent(score, max) { return max ? Math.round((score / max) * 100) : 0; }
  function mockEntries(entries) { return entries.filter(entry => entry.type === 'mock' || entry.type === 'midterm'); }
  function allSkillData(entries) {
    const map = {};
    skillOrder.forEach(item => { map[item.name] = { name: item.name, type: item.type, score: 0, max: 0 }; });
    entries.forEach(entry => {
      if (entry.skills) {
        Object.entries(entry.skills).forEach(([name, value]) => {
          if (!map[name]) map[name] = { name, type: value.type || 'Tracked', score: 0, max: 0 };
          map[name].score += Number(value.score) || 0;
          map[name].max += Number(value.max) || 0;
        });
      } else if (entry.primarySkill) {
        if (!map[entry.primarySkill]) map[entry.primarySkill] = { name: entry.primarySkill, type: 'Lesson score', score: 0, max: 0 };
        map[entry.primarySkill].score += Number(entry.score) || 0;
        map[entry.primarySkill].max += Number(entry.max) || 0;
      }
    });
    return Object.values(map);
  }
  function updateHero(entries) {
    const mocks = mockEntries(entries);
    const best = mocks.length ? Math.max(...mocks.map(entry => entry.percentage ?? percent(entry.score, entry.max))) : null;
    $('#heroAttempts').textContent = String(entries.length);
    $('#heroBest').textContent = best === null ? '—' : `${best}%`;
    const focus = getFocus(entries);
    $('#heroFocus').textContent = focus ? `Next focus: ${focus.name} (${focus.value}%)` : 'Complete a mock exam to create your first baseline.';
  }
  function getFocus(entries) {
    const data = allSkillData(entries).filter(item => item.max > 0);
    if (!data.length) return null;
    const sorted = data.map(item => ({ ...item, value: percent(item.score, item.max) })).sort((a, b) => a.value - b.value);
    return sorted[0];
  }
  function updateMetrics(entries) {
    const mocks = mockEntries(entries);
    const latest = mocks[0];
    const best = mocks.length ? mocks.reduce((bestEntry, entry) => (entry.percentage ?? percent(entry.score, entry.max)) > (bestEntry.percentage ?? percent(bestEntry.score, bestEntry.max)) ? entry : bestEntry) : null;
    $('#latestMock').textContent = latest ? `${latest.percentage ?? percent(latest.score, latest.max)}%` : '—';
    $('#latestMockDetail').textContent = latest ? `${dateDisplay(latest.date)} · ${latest.score} / ${latest.max}` : 'No mock saved yet';
    $('#bestMock').textContent = best ? `${best.percentage ?? percent(best.score, best.max)}%` : '—';
    $('#bestMockDetail').textContent = best ? `${dateDisplay(best.date)} · ${best.score} / ${best.max}` : 'Build your first baseline';
    $('#totalResults').textContent = String(entries.length);
    const focus = getFocus(entries);
    $('#focusSkill').textContent = focus ? focus.name : '—';
    $('#focusDetail').textContent = focus ? `${focus.value}% across saved practice. Build this skill next.` : 'Your lowest tracked skill will appear here.';
  }
  function renderSkills(entries) {
    const target = $('#skillsMap'); target.innerHTML = '';
    const data = allSkillData(entries);
    data.forEach(item => {
      const value = item.max ? percent(item.score, item.max) : 0;
      const row = document.createElement('article'); row.className = 'skill-row';
      row.innerHTML = `<div><span class="skill-name">${safeText(item.name)}</span><span class="skill-type">${safeText(item.type)}</span></div><div class="skill-bar" aria-label="${safeText(item.name)} progress ${value}%"><div class="skill-fill" style="width:${value}%"></div></div><div class="skill-value">${item.max ? `${value}%` : '—'}</div>`;
      target.appendChild(row);
    });
  }
  function entryActivity(entry) {
    const title = safeText(entry.title || 'Practice');
    const type = entry.type === 'mock' ? 'Mock exam' : entry.type === 'midterm' ? 'Midterm checkpoint' : 'Lesson';
    return `<strong>${title}</strong><span class="entry-type">${type}</span>`;
  }
  function entrySkill(entry) {
    if (entry.type === 'mock' || entry.type === 'midterm') return 'Multi-skill';
    return safeText(entry.primarySkill || 'Lesson score');
  }
  function renderHistory(entries) {
    const body = $('#historyBody'); body.innerHTML = '';
    $('#historyCount').textContent = `${entries.length} ${entries.length === 1 ? 'result' : 'results'}`;
    $('#emptyHistory').hidden = entries.length > 0;
    entries.forEach(entry => {
      const tr = document.createElement('tr');
      const p = entry.percentage ?? percent(entry.score, entry.max);
      tr.innerHTML = `<td>${dateDisplay(entry.date)}</td><td>${entryActivity(entry)}</td><td>${entrySkill(entry)}</td><td><span class="score-pill">${entry.score} / ${entry.max}<br>${p}%</span></td><td>${safeText(entry.note || '—')}</td><td><button type="button" class="delete-entry" data-id="${safeText(entry.id)}">Delete</button></td>`;
      body.appendChild(tr);
    });
    body.querySelectorAll('.delete-entry').forEach(button => button.addEventListener('click', () => deleteEntry(button.dataset.id)));
  }
  function render() { const entries = load().sort((a,b) => new Date(b.date) - new Date(a.date)); updateHero(entries); updateMetrics(entries); renderSkills(entries); renderHistory(entries); }
  function deleteEntry(id) {
    const okay = window.confirm('Delete this saved result?');
    if (!okay) return;
    save(load().filter(entry => entry.id !== id));
    render();
  }
  function addManualResult(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const title = $('#lessonTitle').value.trim();
    const score = Number($('#lessonScore').value); const max = Number($('#lessonMax').value);
    if (!title || !Number.isFinite(score) || !Number.isFinite(max) || max <= 0 || score < 0 || score > max) {
      $('#dataMessage').textContent = 'Please enter a title and a valid score (the score cannot be higher than the total).'; return;
    }
    const entry = { id: `lesson-${Date.now()}`, type: 'lesson', title, date: new Date().toISOString(), score, max, percentage: percent(score,max), primarySkill: $('#lessonSkill').value, note: $('#lessonNote').value.trim() };
    const entries = load(); entries.unshift(entry); save(entries); form.reset(); $('#dataMessage').textContent = 'Lesson result saved to the passport.'; render();
  }
  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportData() {
    const payload = { exportedAt: new Date().toISOString(), app: 'Yanis LILATE Score Passport', entries: load() };
    downloadFile(`yanis-lilate-progress-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(payload, null, 2));
    $('#dataMessage').textContent = 'Progress file exported. Keep it somewhere safe before changing device.';
  }
  function importData(event) {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const incoming = Array.isArray(parsed) ? parsed : parsed.entries;
        if (!Array.isArray(incoming)) throw new Error('Invalid file');
        const existing = load(); const ids = new Set(existing.map(item => item.id));
        const merged = [...existing, ...incoming.filter(item => item && item.id && !ids.has(item.id))];
        save(merged); $('#dataMessage').textContent = `${incoming.length} progress entries imported. Duplicate entries were skipped.`; render();
      } catch { $('#dataMessage').textContent = 'That file could not be imported. Please choose a Score Passport export file.'; }
      event.target.value = '';
    };
    reader.readAsText(file);
  }
  function clearData() {
    const okay = window.confirm('Delete every mock and lesson score from this browser? Export first if you may want them later.');
    if (!okay) return;
    localStorage.removeItem(STORAGE_KEY); $('#dataMessage').textContent = 'All local progress data was deleted.'; render();
  }
  $('#manualScoreForm').addEventListener('submit', addManualResult);
  $('#exportData').addEventListener('click', exportData);
  $('#importData').addEventListener('change', importData);
  $('#clearData').addEventListener('click', clearData);
  $('#printReport').addEventListener('click', () => window.print());
  render();
})();
