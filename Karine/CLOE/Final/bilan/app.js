(() => {
  const $ = id => document.getElementById(id);
  function toast(msg){
    const t=$('toast'); if(!t) return;
    t.textContent=msg; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),1800);
  }
  $('printBtn')?.addEventListener('click',()=>window.print());
  $('copyBtn')?.addEventListener('click',async()=>{
    const text = `Karine Cormier — Bilan final détaillé
Niveau global estimé : B1 — en cours de consolidation
Point de départ documenté : A1
Statut Qualiopi : En cours

Vocabulaire : 70% — B1
Grammaire & syntaxe : 70% — B1
Expressions : 90% — C1
Compréhension de textes : 70% — B1
Compréhension orale : 80% — B2
Expression orale : 10,5/20 — 53% — A2
Production écrite : 13/20 — 65% — A2+

Karine a réalisé une progression très nette depuis son niveau initial. Les résultats de cette simulation montrent de bonnes compétences de compréhension et de reconnaissance de la langue. Son expression spontanée reste moins solide que ses compétences de compréhension et doit encore être consolidée afin de stabiliser le niveau B1 dans toutes les situations.`;
    try{ await navigator.clipboard.writeText(text); toast('Synthèse copiée'); }
    catch(e){ toast('Copie indisponible'); }
  });
})();
