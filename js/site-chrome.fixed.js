(async function () {
  async function inject(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    const res = await fetch(url, { cache: "no-store" });
    el.innerHTML = await res.text();
  }

  // 1) Inject shared parts
  await inject("#site-header", "/partials/header.html");
  await inject("#site-footer", "/partials/footer.html");

  // 2) Footer year
  const yearEl = document.getElementById("site-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 3) Hero image + optional hero text overrides per page
  const heroImg = document.body.dataset.heroImage;
  const heroEl = document.querySelector("[data-hero-image]");
  if (heroImg && heroEl) {
    // Use CSS variable so we don't overwrite gradients defined in CSS
    heroEl.style.setProperty("--hero-card-image", `url("${heroImg}")`);
  }

  const heroPos = document.body.dataset.heroPosition;
  if (heroPos && heroEl) heroEl.style.backgroundPosition = heroPos;

  // Optional overrides (use only if you want different hero text per page)
  const map = [
    ["heroSub", "[data-hero-sub]"],
    ["heroTitle", "[data-hero-title]"],
    ["heroTagline", "[data-hero-tagline]"],
    ["heroDesc", "[data-hero-desc]"],
  ];
  map.forEach(([key, sel]) => {
    const val = document.body.dataset[key];
    const node = document.querySelector(sel);
    if (val && node) node.textContent = val;
  });

  // 4) Mobile 100vh fix (prevents “can’t scroll to bottom” issues on phones)
  function setVh() {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  }
  setVh();
  window.addEventListener("resize", setVh);

  // 5) Nav behavior (burger + dropdowns + close on link)
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  function closeMenu() {
    if (!navLinks || !toggle) return;
    navLinks.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    document.querySelectorAll(".has-dropdown.is-open").forEach((p) => p.classList.remove("is-open"));
  }

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("nav-open", isOpen);
      if (isOpen) navLinks.scrollTop = 0;
    });

    // Close menu when clicking a link (mobile)
    navLinks.addEventListener("click", (e) => {
      if (e.target && e.target.matches("a")) closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Dropdowns
  document.querySelectorAll(".has-dropdown").forEach((parent) => {
    const button = parent.querySelector(".nav-button");
    if (!button) return;

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      // Close any other open dropdowns
      document.querySelectorAll(".has-dropdown.is-open").forEach((p) => {
        if (p !== parent) p.classList.remove("is-open");
      });
      parent.classList.toggle("is-open");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    document.querySelectorAll(".has-dropdown.is-open").forEach((parent) => {
      if (!parent.contains(event.target)) parent.classList.remove("is-open");
    });
  });
})();
