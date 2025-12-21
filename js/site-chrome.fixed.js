/* =========================================================
   site-chrome.fixed.js
   Injects header/footer + handles nav behavior (desktop hover + mobile click)
   ========================================================= */

(() => {
  const HEADER_URL = "/partials/header.html";
  const FOOTER_URL = "/partials/footer.html";

  function isMobileNav() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function setVhVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  async function injectFragment(url, mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      mount.innerHTML = await res.text();
    } catch (err) {
      console.warn(`[site-chrome] Failed to load ${url}:`, err);
    }
  }

  function initNav() {
    const nav = document.querySelector(".main-nav");
    if (!nav) return;

    const toggle = nav.querySelector(".nav-toggle");
    const navLinks = nav.querySelector(".nav-links");
    if (!toggle || !navLinks) return;

    const dropdownParents = Array.from(nav.querySelectorAll(".has-dropdown"));

    function closeAllDropdowns(exceptParent = null) {
      dropdownParents.forEach((p) => {
        if (exceptParent && p === exceptParent) return;
        p.classList.remove("is-open");
        const btn = p.querySelector(".nav-button");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }

    function openMenu() {
      navLinks.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
    }

    function closeMenu() {
      navLinks.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      closeAllDropdowns();
    }

    toggle.addEventListener("click", () => {
      const open = navLinks.classList.contains("is-open");
      if (open) closeMenu();
      else openMenu();
    });

    // Close menu when a link is clicked (tap)
    navLinks.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      closeMenu();
    });

    // Dropdown behavior:
    // - Desktop: CSS hover opens; JS supports keyboard focus and closes on mouseleave.
    // - Mobile: click toggles dropdown (JS adds .is-open)
    dropdownParents.forEach((parent) => {
      const btn = parent.querySelector(".nav-button");
      if (!btn) return;

      btn.setAttribute("aria-haspopup", "true");
      btn.setAttribute("aria-expanded", "false");

      // Mobile: click to open/close
      btn.addEventListener("click", (e) => {
        if (!isMobileNav()) return; // desktop hover handles it
        e.preventDefault();
        e.stopPropagation();

        const willOpen = !parent.classList.contains("is-open");
        closeAllDropdowns(parent);
        parent.classList.toggle("is-open", willOpen);
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });

      // Desktop: open on focus (keyboard), close when leaving/focus out
      btn.addEventListener("focus", () => {
        if (isMobileNav()) return;
        closeAllDropdowns(parent);
        parent.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      });

      parent.addEventListener("mouseleave", () => {
        if (isMobileNav()) return;
        parent.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });

      parent.addEventListener("focusout", (e) => {
        if (isMobileNav()) return;
        if (!parent.contains(e.relatedTarget)) {
          parent.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Click outside nav closes dropdowns (and closes mobile menu too)
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target)) {
        closeAllDropdowns();
        if (isMobileNav()) closeMenu();
      }
    });

    // Escape closes everything
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // If you rotate/resize, reset states cleanly
    let lastMobile = isMobileNav();
    window.addEventListener("resize", () => {
      const nowMobile = isMobileNav();
      if (nowMobile !== lastMobile) {
        closeMenu();
        lastMobile = nowMobile;
      }
    });
  }

  async function start() {
    setVhVar();
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setVhVar);
    }
    window.addEventListener("resize", setVhVar);
    window.addEventListener("orientationchange", setVhVar);

    await injectFragment(HEADER_URL, "site-header");
    await injectFragment(FOOTER_URL, "site-footer");

    initNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
