(function () {
  const celebrateBtn = document.getElementById('celebrateBtn');
  const printBtn = document.getElementById('printBtn');
  const resetProgressBtn = document.getElementById('resetProgressBtn');
  const confettiLayer = document.getElementById('confettiLayer');
  const revealItems = document.querySelectorAll('.reveal');
  const navLinks = document.querySelectorAll('.topnav a');
  const practiceChecks = document.querySelectorAll('.practice-check');
  const completedCount = document.getElementById('completedCount');
  const trackerMessage = document.getElementById('trackerMessage');
  const storageKey = 'fabricePracticeTrackerV2';

  function revealOnScroll() {
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createConfettiBurst(count) {
    if (!confettiLayer) return;

    const palette = ['#7a8cff', '#95a6ff', '#ffbe64', '#37d39a', '#ffffff'];

    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${randomBetween(0, 100)}vw`;
      piece.style.background = palette[Math.floor(Math.random() * palette.length)];
      piece.style.animationDuration = `${randomBetween(3.8, 6.4)}s`;
      piece.style.animationDelay = `${randomBetween(0, 0.75)}s`;
      piece.style.opacity = `${randomBetween(0.75, 0.98)}`;
      piece.style.width = `${randomBetween(8, 14)}px`;
      piece.style.height = `${randomBetween(12, 20)}px`;
      piece.style.setProperty('--drift', `${randomBetween(-140, 140)}px`);
      confettiLayer.appendChild(piece);

      window.setTimeout(() => piece.remove(), 7000);
    }
  }

  function celebrate() {
    createConfettiBurst(90);
    window.setTimeout(() => createConfettiBurst(60), 450);
  }

  function saveProgress() {
    const state = {};
    practiceChecks.forEach((checkbox) => {
      state[checkbox.dataset.task] = checkbox.checked;
    });
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
      practiceChecks.forEach((checkbox) => {
        checkbox.checked = Boolean(saved[checkbox.dataset.task]);
      });
    } catch (error) {
      // ignore broken local storage data
    }
  }

  function updateTracker() {
    const total = practiceChecks.length;
    const completed = Array.from(practiceChecks).filter((checkbox) => checkbox.checked).length;

    if (completedCount) {
      completedCount.textContent = completed;
    }

    if (!trackerMessage) return;

    if (completed === 0) {
      trackerMessage.textContent = 'Start with one activity today. Small steps count.';
    } else if (completed < 5) {
      trackerMessage.textContent = 'Great start. Confidence grows through regular practice.';
    } else if (completed < total) {
      trackerMessage.textContent = 'Excellent. Keep the routine simple, calm, and consistent.';
    } else {
      trackerMessage.textContent = 'Wonderful work. This is exactly how progress is built.';
    }
  }

  function resetProgress() {
    practiceChecks.forEach((checkbox) => {
      checkbox.checked = false;
    });
    window.localStorage.removeItem(storageKey);
    updateTracker();
  }

  function activateNavOnScroll() {
    const sections = Array.from(navLinks)
      .map((link) => {
        const target = document.querySelector(link.getAttribute('href'));
        return target ? { link, target } : null;
      })
      .filter(Boolean);

    function setActiveLink() {
      const scrollPosition = window.scrollY + 140;
      let activeSection = sections[0];

      sections.forEach((section) => {
        if (section.target.offsetTop <= scrollPosition) {
          activeSection = section;
        }
      });

      sections.forEach((section) => {
        section.link.classList.toggle('active', section === activeSection);
      });
    }

    setActiveLink();
    window.addEventListener('scroll', setActiveLink, { passive: true });
  }

  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', celebrate);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', resetProgress);
  }

  practiceChecks.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      saveProgress();
      updateTracker();
    });
  });

  revealOnScroll();
  loadProgress();
  updateTracker();
  activateNavOnScroll();

  window.setTimeout(() => {
    createConfettiBurst(40);
  }, 500);
})();
