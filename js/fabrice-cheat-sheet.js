const printBtn = document.getElementById('printBtn');
const expandBtn = document.getElementById('expandBtn');
const detailsEls = Array.from(document.querySelectorAll('details.detail'));
const copyBtns = Array.from(document.querySelectorAll('.copy-btn'));

if (printBtn) {
  printBtn.addEventListener('click', () => window.print());
}

let expanded = true;
if (expandBtn) {
  expandBtn.addEventListener('click', () => {
    expanded = !expanded;
    detailsEls.forEach(el => { el.open = expanded; });
    expandBtn.textContent = expanded ? 'Collapse all' : 'Expand all';
  });
  expandBtn.textContent = 'Collapse all';
}

copyBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy') || '';
    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('done');
      setTimeout(() => {
        btn.textContent = old;
        btn.classList.remove('done');
      }, 1400);
    } catch (e) {
      btn.textContent = 'Copy failed';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1400);
    }
  });
});