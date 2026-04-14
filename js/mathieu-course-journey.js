
(function(){
  const sessions = Array.isArray(window.MATHIEU_SESSIONS) ? window.MATHIEU_SESSIONS.slice() : [];
  const story = Array.isArray(window.MATHIEU_STORY) ? window.MATHIEU_STORY : [];
  const categoryMeta = window.MATHIEU_CATEGORY_META || {};

  const timelineEl = document.getElementById('timeline');
  const themeMapGrid = document.getElementById('themeMapGrid');
  const resourceGroups = document.getElementById('resourceGroups');
  const chipRow = document.getElementById('categoryChips');
  const searchInput = document.getElementById('searchInput');
  const resultsSummary = document.getElementById('resultsSummary');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const copyLibraryNoteBtn = document.getElementById('copyLibraryNoteBtn');
  const copyNoteBtn = document.getElementById('copyNoteBtn');

  let activeCategory = 'all';
  let activeQuery = '';

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g, function(char){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char];
    });
  }

  function formatDate(isoDate){
    const parts = String(isoDate).split('-');
    if(parts.length !== 3) return isoDate;
    const date = new Date(parts[0], Number(parts[1]) - 1, parts[2]);
    return new Intl.DateTimeFormat('en-GB', { day:'2-digit', month:'short', year:'numeric' }).format(date);
  }

  function countLinks(items){
    return items.reduce((sum, item) => sum + ((item.links && item.links.length) || 0), 0);
  }

  function setStats(){
    const themeCount = Object.keys(categoryMeta).filter((key) => key !== 'all').length;
    const sessionCountEl = document.getElementById('statSessionCount');
    const resourceCountEl = document.getElementById('statResourceCount');
    const themeCountEl = document.getElementById('statThemeCount');
    if(sessionCountEl) sessionCountEl.textContent = String(sessions.length);
    if(resourceCountEl) resourceCountEl.textContent = String(countLinks(sessions));
    if(themeCountEl) themeCountEl.textContent = String(themeCount);
  }

  function renderTimeline(){
    if(!timelineEl) return;
    timelineEl.innerHTML = story.map(function(item, idx){
      const phaseName = escapeHtml(item.title);
      const themes = Array.isArray(item.topThemes) ? item.topThemes : [];
      return `
        <article class="story-card" id="${escapeHtml(item.id || ('story-' + idx))}">
          <p class="eyebrow">${escapeHtml(item.eyebrow || ('Chapter ' + (idx + 1)))}</p>
          <h3>${phaseName}</h3>
          <p>${escapeHtml(item.text || '')}</p>
          <div class="story-meta">
            <span class="story-chip">${escapeHtml((item.range || '').replaceAll('-', '–'))}</span>
            <span class="story-chip">${escapeHtml(String(item.sessionCount || 0))} sessions</span>
          </div>
          <div class="story-footer">
            <div class="story-tags">
              ${themes.map(function(tag){ return `<span class="theme-mini">${escapeHtml(tag)}</span>`; }).join('')}
            </div>
            <button class="jump-btn" type="button" data-phase="${phaseName}">Show this phase</button>
          </div>
        </article>
      `;
    }).join('');

    timelineEl.addEventListener('click', function(event){
      const btn = event.target.closest('[data-phase]');
      if(!btn) return;
      const phase = btn.getAttribute('data-phase') || '';
      searchInput.value = phase;
      activeQuery = phase;
      renderResources();
      document.getElementById('library')?.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  function renderThemeMap(){
    if(!themeMapGrid) return;
    const counts = {};
    sessions.forEach(function(session){
      (session.categories || []).forEach(function(cat){
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });

    const categories = Object.keys(counts).sort(function(a,b){
      return (categoryMeta[a]?.label || a).localeCompare(categoryMeta[b]?.label || b);
    });

    themeMapGrid.innerHTML = categories.map(function(cat){
      const meta = categoryMeta[cat] || {label: cat, desc: ''};
      return `
        <article class="theme-tile">
          <h3>${escapeHtml(meta.label || cat)}</h3>
          <p>${escapeHtml(meta.desc || '')}</p>
          <span class="theme-count">${escapeHtml(String(counts[cat]))} lessons</span>
        </article>
      `;
    }).join('');
  }

  function renderChips(){
    if(!chipRow) return;
    const categories = ['all'].concat(
      Object.keys(categoryMeta).filter(function(key){ return key !== 'all'; }).sort(function(a,b){
        return (categoryMeta[a]?.label || a).localeCompare(categoryMeta[b]?.label || b);
      })
    );
    chipRow.innerHTML = categories.map(function(cat){
      const label = (categoryMeta[cat] && categoryMeta[cat].label) ? categoryMeta[cat].label : cat;
      return `<button class="chip ${cat === activeCategory ? 'is-active' : ''}" type="button" data-category="${escapeHtml(cat)}">${escapeHtml(label)}</button>`;
    }).join('');

    chipRow.addEventListener('click', function(event){
      const btn = event.target.closest('[data-category]');
      if(!btn) return;
      activeCategory = btn.getAttribute('data-category') || 'all';
      updateActiveChip();
      renderResources();
    });
  }

  function updateActiveChip(){
    if(!chipRow) return;
    chipRow.querySelectorAll('.chip').forEach(function(chip){
      chip.classList.toggle('is-active', chip.getAttribute('data-category') === activeCategory);
    });
  }

  function matchesQuery(session, query){
    if(!query) return true;
    const categories = (session.categories || []).map(function(cat){ return (categoryMeta[cat] && categoryMeta[cat].label) ? categoryMeta[cat].label : cat; });
    const linkLabels = (session.links || []).map(function(link){ return link.label || ''; });
    const haystack = [
      session.date,
      session.title,
      session.phase,
      session.summary,
      (session.focus || []).join(' '),
      categories.join(' '),
      linkLabels.join(' ')
    ].join(' ').toLowerCase();
    return haystack.includes(query);
  }

  function getFilteredSessions(){
    const query = activeQuery.trim().toLowerCase();
    return sessions.filter(function(session){
      const categoryOk = activeCategory === 'all' || (session.categories || []).includes(activeCategory);
      return categoryOk && matchesQuery(session, query);
    });
  }

  function groupByPhase(items){
    const map = new Map();
    items.forEach(function(item){
      if(!map.has(item.phase)) map.set(item.phase, []);
      map.get(item.phase).push(item);
    });
    return Array.from(map.entries());
  }

  function renderResources(){
    if(!resourceGroups) return;
    const filtered = getFilteredSessions();
    const groups = groupByPhase(filtered);
    const linkCount = countLinks(filtered);

    if(resultsSummary){
      const activeLabel = activeCategory === 'all' ? 'all themes' : ((categoryMeta[activeCategory] && categoryMeta[activeCategory].label) || activeCategory);
      resultsSummary.textContent = `${filtered.length} session${filtered.length === 1 ? '' : 's'} shown • ${linkCount} lesson link${linkCount === 1 ? '' : 's'} • ${activeLabel}`;
    }

    if(!filtered.length){
      resourceGroups.innerHTML = '<div class="empty-state">No sessions match this filter yet. Try another search term or choose “All themes”.</div>';
      return;
    }

    resourceGroups.innerHTML = groups.map(function(entry){
      const phase = entry[0];
      const items = entry[1];
      const groupDescription = story.find(function(chapter){ return chapter.title === phase; })?.text || '';
      return `
        <section class="phase-group">
          <div class="phase-head">
            <div>
              <h3>${escapeHtml(phase)}</h3>
              <p>${escapeHtml(groupDescription)}</p>
            </div>
            <span class="phase-count">${escapeHtml(String(items.length))} session${items.length === 1 ? '' : 's'}</span>
          </div>
          <div class="session-grid">
            ${items.map(function(item){
              const categories = (item.categories || []).map(function(cat){
                const label = (categoryMeta[cat] && categoryMeta[cat].label) ? categoryMeta[cat].label : cat;
                return `<span class="tag">${escapeHtml(label)}</span>`;
              }).join('');
              const focus = (item.focus || []).map(function(bit){
                return `<span class="focus-pill">${escapeHtml(bit)}</span>`;
              }).join('');
              const links = (item.links || []).map(function(link){
                return `<a class="link-btn primary" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label || 'Open resource')} ↗</a>`;
              }).join('');
              return `
                <article class="session-card">
                  <span class="session-date">${escapeHtml(formatDate(item.date))}</span>
                  <h4>${escapeHtml(item.title)}</h4>
                  <p class="session-summary">${escapeHtml(item.summary || '')}</p>
                  <div class="focus-list">${focus}</div>
                  <div class="tag-row">${categories}</div>
                  <div class="link-stack">${links}</div>
                </article>
              `;
            }).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function(resolve, reject){
      try{
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'absolute';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        resolve();
      }catch(err){
        reject(err);
      }
    });
  }

  function flashButton(button, successText){
    if(!button) return;
    const old = button.textContent;
    button.textContent = successText;
    setTimeout(function(){ button.textContent = old; }, 1400);
  }

  searchInput?.addEventListener('input', function(event){
    activeQuery = event.target.value || '';
    renderResources();
  });

  clearFiltersBtn?.addEventListener('click', function(){
    activeCategory = 'all';
    activeQuery = '';
    if(searchInput) searchInput.value = '';
    updateActiveChip();
    renderResources();
  });

  copyLibraryNoteBtn?.addEventListener('click', function(){
    const text = 'This page brings together Mathieu’s full course journey: lesson themes, practice focus, and every resource link in one place.';
    copyText(text).then(function(){ flashButton(copyLibraryNoteBtn, 'Copied'); });
  });

  copyNoteBtn?.addEventListener('click', function(){
    const text = 'This page keeps the whole journey visible: the lessons, the work, the themes, and the progress built step by step.';
    copyText(text).then(function(){ flashButton(copyNoteBtn, 'Copied'); });
  });

  setStats();
  renderTimeline();
  renderThemeMap();
  renderChips();
  renderResources();
})();
