/* ==========================================================================
   JASPER TANG SEE YONG — PORTFOLIO INTERACTIVITY
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const hasIO = "IntersectionObserver" in window;

  // 1. Footer year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Day / night toggle (initial theme is set inline in <head>)
  const themeToggle = document.getElementById("themeToggle");
  const syncToggleLabel = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to day mode" : "Switch to night mode");
  };
  syncToggleLabel();

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("jasper-portfolio-theme", next); } catch (e) { /* private mode */ }
    syncToggleLabel();
  });

  // 3. Navbar: transparent over the hero, solid after scrolling
  const navbar = document.getElementById("navbar");
  const hero = document.getElementById("home");
  if (navbar) {
    let ticking = false;
    const updateNav = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateNav);
      }
    }, { passive: true });
    updateNav();
  }

  // 4. Pause hero animations when the hero is off-screen (saves GPU/battery)
  const scene = document.getElementById("heroScene");
  if (scene && hero && hasIO) {
    new IntersectionObserver(([entry]) => {
      scene.classList.toggle("is-paused", !entry.isIntersecting);
    }).observe(hero);
  }

  // 5. Scroll reveal (one-time fade-up)
  const reveals = document.querySelectorAll(".reveal");
  if (hasIO) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // 6. Highlight the nav link of the section in view
  const navLinks = document.querySelectorAll(".nav-link");
  if (hasIO && navLinks.length) {
    const linkFor = new Map();
    navLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      if (section) linkFor.set(section, link);
    });
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          linkFor.get(entry.target)?.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    linkFor.forEach((_, section) => sectionObserver.observe(section));
  }

  // 7. Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const closeMenu = () => {
    navMenu?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navMenu.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target)) closeMenu();
    });
  }

  // 8. Pick A-Frame frame switcher
  const demoFrame = document.getElementById("demoFrame");
  const frameSwatches = document.querySelectorAll(".frame-swatch");
  frameSwatches.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (demoFrame) demoFrame.className = `artwork-frame ${btn.dataset.frame}`;
      frameSwatches.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
    });
  });

  // 9. Project filters
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(/\s+/);
        const show = filter === "all" || categories.includes(filter);
        card.classList.toggle("hidden", !show);
        if (show) card.classList.add("is-visible");
      });
    });
  });

  // 10. Design lightbox
  const designModal = document.getElementById("designModal");
  const closeModalBtn = document.getElementById("closeDesignModalBtn");
  let lastFocus = null;

  const openModal = () => {
    if (!designModal) return;
    lastFocus = document.activeElement;
    designModal.classList.add("open");
    designModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeModalBtn?.focus();
  };

  const closeModal = () => {
    if (!designModal || !designModal.classList.contains("open")) return;
    designModal.classList.remove("open");
    designModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocus?.focus();
  };

  document.querySelectorAll("[data-open-modal]").forEach((el) => el.addEventListener("click", openModal));
  closeModalBtn?.addEventListener("click", closeModal);
  designModal?.addEventListener("click", (e) => {
    if (e.target === designModal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeMenu();
    }
  });

  // 11. Copy email
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  copyEmailBtn?.addEventListener("click", async () => {
    const email = copyEmailBtn.dataset.email || "jaspertsy2005@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      const original = copyEmailBtn.textContent;
      copyEmailBtn.textContent = "✓ Copied";
      setTimeout(() => { copyEmailBtn.textContent = original; }, 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  // 12. Quick mail form → opens the visitor's email app
  const quickMailForm = document.getElementById("quickMailForm");
  quickMailForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const sender = document.getElementById("senderName")?.value.trim() || "Recruiter";
    const message = document.getElementById("senderMessage")?.value.trim() || "";
    const subject = encodeURIComponent(`Portfolio inquiry from ${sender}`);
    const body = encodeURIComponent(`${message}\n\n— Sent via Jasper Tang's portfolio`);
    window.location.href = `mailto:jaspertsy2005@gmail.com?subject=${subject}&body=${body}`;
  });
});
